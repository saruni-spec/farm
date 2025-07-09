import os
import json
import geopandas as gpd
from PIL import Image # Pillow
from samgeo import SamGeo
import leafmap
from osgeo import gdal
import numpy as np
import pandas as pd
from supabase import create_client, Client
from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
import uuid
from datetime import datetime
from analysis import compute_and_export_from_bbox 

# --- Supabase Configuration ---
SUPABASE_URL = "https://ounttrkvhnvhzfgtyklo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bnR0cmt2aG52aHpmZ3R5a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMwNDk5OCwiZXhwIjoyMDYyODgwOTk4fQ.AFjO6VdBYgm-tK5VxxXkGhzQ2w1X2XLnf69maEj7WbQ"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✅ Supabase client initialized successfully.")

def test_supabase_connection():
    """Test the Supabase connection"""
    try:
        response = supabase.table("segmentation_tasks").select("*").limit(1).execute()
        print("✅ Successfully connected to Supabase database.")
        return True
    except Exception as e:
        print(f"❌ Unable to connect to Supabase: {e}")
        return False

# --- SAMGeo Initialization ---
sam = None
try:
    print("⏳ Initializing SAMGeo model... (This might take a moment)")
    sam = SamGeo(model_type="vit_h", sam_kwargs=None) # Default model
   # sam = SamGeo(model_type="vit_b", sam_kwargs=None)

    # change it to this in local if the other model does not work
    # sam = SamGeo(model_type="vit_b", sam_kwargs=None) # Changed to vit_b
    print("✅ SAMGeo initialized successfully.")
except Exception as e:
    print(f"❌ Failed to initialize SAMGeo: {str(e)}")
    print("Ensure all dependencies, including PyTorch and torchvision compatible with your Colab CUDA version, are installed.")

def run_segmentation(farmer_id, min_lon, min_lat, max_lon, max_lat,selected_area_id=None):
    if not selected_area_id:
        selected_area_id = uuid.uuid4().hex
    if sam is None:
        raise RuntimeError("SAMGeo is not initialized. Check previous errors.")
    if not test_supabase_connection():
        raise RuntimeError("Failed to connect to Supabase. Check credentials and configuration.")

    task_id = None
    image_id = None
    mask_id = None

   
    os.makedirs("data", exist_ok=True)
    temp_id = uuid.uuid4().hex
   
    image_file = f"./data/satellite_image_{temp_id}.tif"
    mask_file = f"./data/masks_{temp_id}.tif"
    vector_file_temp = f"./data/masks_{temp_id}.geojson"

    try:
        # Insert task record
        task_response = supabase.table("segmentation_tasks").insert({
            "farm_id": selected_area_id,
            "requested_min_lon": min_lon,
            "requested_min_lat": min_lat,
            "requested_max_lon": max_lon,
            "requested_max_lat": max_lat,
            "status": "pending"
        }).execute()

        if not task_response.data:
            raise RuntimeError("Failed to create segmentation task")

        task_id = task_response.data[0]["task_id"]
        print(f"✅ DB: Created segmentation_tasks record with task_id: {task_id}")

        # Update status to processing
        supabase.table("segmentation_tasks").update({
            "status": "processing",
            "processing_start_time": datetime.utcnow().isoformat()
        }).eq("task_id", task_id).execute()

        if not (-180 <= min_lon <= max_lon <= 180 and -90 <= min_lat <= max_lat <= 90):
            raise ValueError("Invalid coordinates")
        coords = [min_lon, min_lat, max_lon, max_lat]

        print(f"🛰️ Downloading satellite imagery to {image_file}...")
        leafmap.tms_to_geotiff(
            output=image_file, bbox=coords, zoom=15, source="SATELLITE", overwrite=True
        )
        if not os.path.exists(image_file):
            raise RuntimeError(f"Failed to download imagery to {os.path.abspath(image_file)}")
        print(f"✅ Imagery downloaded to {os.path.abspath(image_file)}")

        ds = gdal.Open(image_file)
        if ds is None:
            raise RuntimeError(f"GDAL could not open the downloaded image file: {image_file}")
        gt = ds.GetGeoTransform()
        img_min_lon_tile, img_max_lat_tile = gt[0], gt[3]
        img_max_lon_tile = img_min_lon_tile + ds.RasterXSize * gt[1]
        img_min_lat_tile = img_max_lat_tile + ds.RasterYSize * gt[5]
        ds = None # Close dataset

        # Create WKT for bbox - we'll store as text and convert in database
        img_bbox_wkt = f"POLYGON(({img_min_lon_tile} {img_min_lat_tile}, {img_min_lon_tile} {img_max_lat_tile}, {img_max_lon_tile} {img_max_lat_tile}, {img_max_lon_tile} {img_min_lat_tile}, {img_min_lon_tile} {img_min_lat_tile}))"

        # Insert satellite image record
        image_response = supabase.table("satellite_images").insert({
            "task_id": task_id,
            "image_source_details": {"zoom": 15, "source": "SATELLITE"},
            "image_bbox_geom": img_bbox_wkt, 
            "image_crs_epsg": 3857,
            "image_raster": None
        }).execute()

        if not image_response.data:
            raise RuntimeError("Failed to create satellite image record")

        image_id = image_response.data[0]["image_id"]
        print(f"✅ DB: Created satellite_images record with image_id: {image_id}")

        print(f"🧠 Running segmentation, outputting mask to {mask_file}...")
        if os.path.exists(mask_file): os.remove(mask_file)
        sam.generate(image_file, output=mask_file, foreground=True, unique=True, points_per_batch=32)
        if not os.path.exists(mask_file):
            raise RuntimeError("Failed to generate mask file")
        print(f"✅ Mask generated: {os.path.abspath(mask_file)}")

        # Insert segmentation mask record
        mask_response = supabase.table("segmentation_masks").insert({
            "task_id": task_id,
            "source_image_id": image_id,
            "sam_model_type": sam.model_type,
            "mask_bbox_geom": img_bbox_wkt,
            "mask_crs_epsg": 3857,
            "mask_raster": None
        }).execute()

        if not mask_response.data:
            raise RuntimeError("Failed to create segmentation mask record")

        mask_id = mask_response.data[0]["mask_id"]
        print(f"✅ DB: Created segmentation_masks record with mask_id: {mask_id}")

        print(f"🔄 Converting mask to vector (temp file: {vector_file_temp})...")
        if os.path.exists(vector_file_temp): os.remove(vector_file_temp)
        sam.tiff_to_vector(mask_file, vector_file_temp)
        if not os.path.exists(vector_file_temp):
            raise RuntimeError("Failed to generate vector file")
        print(f"✅ Vector file generated: {os.path.abspath(vector_file_temp)}")

        gdf = gpd.read_file(vector_file_temp)
        gdf.set_crs(epsg=3857, inplace=True, allow_override=True)
        gdf = gdf.to_crs(epsg=4326)
        print(f"🌍 GeoDataFrame CRS after reprojection: {gdf.crs}, features: {len(gdf)}")

        if gdf.empty:
            print("⚠️ No features found after vectorization.")
            supabase.table("segmentation_tasks").update({
                "status": "completed_no_features",
                "processing_end_time": datetime.utcnow().isoformat()
            }).eq("task_id", task_id).execute()
            return {"type": "FeatureCollection", "features": []}

        gdf = gdf.replace([np.inf, -np.inf], np.nan)
        def is_geometry_valid_for_json(geom):
            try:
                coords = json.dumps(gpd.GeoSeries([geom]).__geo_interface__["features"][0]["geometry"]["coordinates"])
                return 'NaN' not in coords and 'Infinity' not in coords and geom.is_valid and not geom.is_empty
            except Exception: return False
        gdf = gdf[gdf['geometry'].apply(is_geometry_valid_for_json)]
        gdf = gdf.dropna(subset=['geometry'])
        print(f"📐 Valid features after cleaning: {len(gdf)}")

        if gdf.empty:
            print("⚠️ No valid features after cleaning.")
            supabase.table("segmentation_tasks").update({
                "status": "completed_no_valid_features",
                "processing_end_time": datetime.utcnow().isoformat()
            }).eq("task_id", task_id).execute()
            return {"type": "FeatureCollection", "features": []}

        # Insert geometries in batches for better performance
        geometries_to_insert = []
        saved_features_count = 0

        for index, row in gdf.iterrows():
            try:
                geom_geojson = row.geometry.__geo_interface__
                properties = row.drop('geometry').to_dict()
                for k, v in properties.items():
                    if isinstance(v, (np.integer, np.floating, np.bool_)): properties[k] = v.item()
                    elif isinstance(v, np.datetime64): properties[k] = str(v)
                    elif pd.isna(v): properties[k] = None # 

                # Inside run_segmentation, where geometries_to_insert is prepared:
                geometries_to_insert.append({
                    "selected_area_id": selected_area_id, 
                    "farmer_id": farmer_id,
                    "segmentation_task_id": task_id, 
                    "source_mask_id": mask_id,
                    "geometry": geom_geojson, 
                    "properties": properties 
                })
              
                saved_features_count += 1

                # Insert in batches of 100 to avoid payload limits
                if len(geometries_to_insert) >= 100:
                  supabase.table("farm").insert(geometries_to_insert).execute() # Target new table
                  geometries_to_insert = []

            except Exception as e_insert:
                print(f"❌ Error preparing geometry for row {index}: {e_insert}")

        # Insert remaining geometries
        created_farms = []
        if geometries_to_insert:
            response = supabase.table("farm").insert(geometries_to_insert).execute() # Target new table
            if response.data:
                created_farms=response.data


        print(f"✅ DB: Inserted {saved_features_count} features into segmented_geometries table.")

       
        supabase.table("segmentation_tasks").update({
            "status": "completed",
            "processing_end_time": datetime.utcnow().isoformat()
        }).eq("task_id", task_id).execute()

        return created_farms

    except (ValueError, RuntimeError) as e:
        if task_id: 
            try:
                supabase.table("segmentation_tasks").update({
                    "status": "failed",
                    "error_message": str(e),
                    "processing_end_time": datetime.utcnow().isoformat()
                }).eq("task_id", task_id).execute()
            except Exception as e_rollback:
                print(f"❌ Error during failure update: {e_rollback}")
        print(f"❌ Error during segmentation or DB operation: {e}")
        import traceback
        traceback.print_exc() 
        raise
    finally:
        # Clean up temporary files
        for f_path in [image_file, mask_file, vector_file_temp]:
            if os.path.exists(f_path):
                try:
                    os.remove(f_path)
                    print(f"🗑️ Cleaned up temporary file: {f_path}")
                except OSError as e_remove:
                    print(f"⚠️ Could not remove temp file {f_path}: {e_remove}")

# --- Flask Application ---
app = Flask(__name__)
CORS(app) 

@app.route("/")
def home():
    return """
    <h1>Flask Segmentation Backend is Running!</h1>
    <p>The Flask app is running successfully with Supabase.</p>
    <p>Available endpoints:</p>
    <ul>
        <li>POST /segment - Run segmentation</li>
        <li>GET /api/segments?farm_id=xxx - Get segments for farm</li>
    </ul>
    """

@app.route('/segment', methods=['POST'])
def segment_route():
    try:
        data = request.get_json(force=True)
        selected_area_id = data.get("selected_area_id")
        if not selected_area_id:
            selected_area_id = uuid.uuid4().hex
        else:
            try:
                uuid.UUID(str(selected_area_id)) 
            except ValueError:
                return jsonify({"error": "Invalid farm_id format. It must be a valid UUID."}), 400
         

        farmer_id = data.get("farmer_id")
        if not farmer_id: return jsonify({"error": "Missing farmer_id."}), 400
        try: uuid.UUID(farmer_id)
        except ValueError: return jsonify({"error": "Invalid farmer_id format."}), 400

        bbox_data = data.get("bbox")
        if not (isinstance(bbox_data, list) and len(bbox_data) == 4 and all(isinstance(c, (float, int)) for c in bbox_data)):
            return jsonify({"error": "Invalid bounding box format."}), 400
        min_lon, min_lat, max_lon, max_lat = bbox_data

        print(f"➡️ API: Received segmentation request for farm_id: {selected_area_id}, bbox: [{min_lon}, {min_lat}, {max_lon}, {max_lat}]")
        result_geojson = run_segmentation(farmer_id, float(min_lon), float(min_lat), float(max_lon), float(max_lat),selected_area_id)
        return jsonify(result_geojson)
    except (ValueError, TypeError) as e:
        print(f"❌ API Error (Invalid input): {str(e)}")
        return jsonify({"error": f"Invalid input or data structure: {str(e)}"}), 400
    except RuntimeError as e:
        print(f"❌ API Error (Runtime): {str(e)}")
        return jsonify({"error": f"Processing error: {str(e)}"}), 500
    except Exception as e:
        print(f"❌ API Error (Unexpected): {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/api/farms', methods=['GET'])
def get_farms():
    farmer_id = request.args.get('farmer_id')
    if not farmer_id: return jsonify({"error": "farmer_id query parameter is required."}), 400
    try: uuid.UUID(farmer_id)
    except ValueError: return jsonify({"error": "Invalid farmer_id format."}), 400

    try:
    
        # Query farm_segment table using the segmentation_task_id
        segments_response = supabase.table("farm").select("id, name, geometry, properties").eq("farmer_id", farmer_id).order("id").execute() # "id" or "created_at" for order

        return jsonify(segments_response.data)

    except Exception as e:
        print(f"❌ API Error (get_farm_segments): {e}")
        return jsonify({"error": "Failed to retrieve segments from database."}), 500



@app.route('/api/selected_area', methods=['POST'])
def create_selected_area_route():
    try:
        data = request.get_json(force=True)

        farmer_id = data.get("farmer_id")
        farm_geometry_geojson = data.get("geometry") # Expecting a GeoJSON geometry object
       

        if not farmer_id:
            return jsonify({"error": "Missing farmer_id."}), 400
        try:
            uuid.UUID(farmer_id) # Validate farmer_id format
        except ValueError:
            return jsonify({"error": "Invalid farmer_id format."}), 400

        if not farm_geometry_geojson:
            return jsonify({"error": "Missing farm geometry."}), 400

      

        
        farm_data_to_insert = {
            "farmer_id": farmer_id,
            "geometry": farm_geometry_geojson,
        }

        print(f"➡️ API: Received request to create farm: {farm_data_to_insert,farmer_id}")

        # Ensure the farmer_id exists in the public.farmer table
        
        farmer_check_response = supabase.table("farmer").select("profile_id").eq("profile_id", farmer_id).limit(1).execute()
        if not farmer_check_response.data:
            print(f"❌ API Error: Farmer with farmer_id {farmer_id} not found.")
            return jsonify({"error": f"Farmer with farmer_id {farmer_id} not found."}), 404


        response = supabase.table("selected_area").insert(farm_data_to_insert).execute()

        if response.data:
            created_farm = response.data[0]
            print(f"✅ DB: Created farm record with id: {created_farm['id']}")
            return jsonify({
                "message": "Selected area created successfully",
                "selected_area_id": created_farm['id'],
                "farmer_id": created_farm['farmer_id'],
                "geometry": created_farm.get('geometry')
            }), 201
        else:
           
            error_detail = "Unknown error during selected area creation."
            if hasattr(response, 'error') and response.error:
                error_detail = response.error.message if hasattr(response.error, 'message') else str(response.error)
            print(f"❌ API Error: Failed to create selected area. Details: {error_detail if error_detail else 'No specific error details from Supabase.'}")
            return jsonify({"error": "Failed to create selected area in database.", "details": error_detail}), 500

    except Exception as e:
        print(f"❌ API Error (create_selected_area_route): {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/api/farms', methods=['POST'])
def create_farm():
    """Create a new farm with a name"""
    try:
        data = request.get_json(force=True)
        
        farm_name = data.get("name")
        farmer_id = data.get("farmer_id")
        selected_area_id = data.get("selected_area_id")
        farm_geometry = data.get("geometry")  # Optional geometry
        
        if not farm_name:
            return jsonify({"error": "Missing farm name."}), 400
            
        if not farmer_id:
            return jsonify({"error": "Missing farmer_id."}), 400

            
        try:
            uuid.UUID(farmer_id)
        except ValueError:
            return jsonify({"error": "Invalid farmer_id format."}), 400
        
        # Verify farmer exists
        farmer_check = supabase.table("farmer").select("profile_id").eq("profile_id", farmer_id).limit(1).execute()
        if not farmer_check.data:
            return jsonify({"error": f"Farmer with farmer_id {farmer_id} not found."}), 404
        
        farm_data = {
            "name": farm_name,
            "farmer_id": farmer_id,
            "selected_area_id": selected_area_id,
        }
        
        # Add geometry if provided
        if farm_geometry:
            farm_data["geometry"] = farm_geometry
            
        print(f"➡️ API: Creating farm with name: {farm_name}")
        
        response = supabase.table("farm").insert(farm_data).execute()
        
        if response.data:
            created_farm = response.data[0]
            print(f"✅ DB: Created farm '{farm_name}' with id: {created_farm.get('id')}")
            return jsonify({
                "message": "Farm created successfully",
                "farm": created_farm
            }), 201
        else:
            return jsonify({"error": "Failed to create farm."}), 500
            
    except Exception as e:
        print(f"❌ API Error (create_farm): {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/api/farms/<farm_id>', methods=['PUT'])
def update_farm_name(farm_id):
    """Update a farm's name"""
    try:
        # Validate farm_id format
        try:
            uuid.UUID(farm_id)
        except ValueError:
            return jsonify({"error": "Invalid farm_id format."}), 400
            
        data = request.get_json(force=True)
        new_name = data.get("name")
        
        if not new_name:
            return jsonify({"error": "Missing new farm name."}), 400
            
        print(f"➡️ API: Updating farm {farm_id} with new name: {new_name}")
        
        # Check if farm exists first
        farm_check = supabase.table("farm").select("id, name").eq("id", farm_id).limit(1).execute()
        if not farm_check.data:
            return jsonify({"error": "Farm not found."}), 404
            
        # Update the farm name
        response = supabase.table("farm").update({"name": new_name}).eq("id", farm_id).execute()
        
        if response.data:
            updated_farm = response.data[0]
            print(f"✅ DB: Updated farm {farm_id} name to: {new_name}")
            return jsonify({
                "message": "Farm name updated successfully",
                "farm": updated_farm
            }), 200
        else:
            return jsonify({"error": "Failed to update farm name."}), 500
            
    except Exception as e:
        print(f"❌ API Error (update_farm_name): {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route('/api/farms/<farm_id>', methods=['DELETE'])
def delete_farm(farm_id):
    """Delete a farm by its ID"""
    try:
        # Validate farm_id format
        try:
            uuid.UUID(farm_id)
        except ValueError:
            return jsonify({"error": "Invalid farm_id format."}), 400
            
        print(f"➡️ API: Deleting farm {farm_id}")
        
        # Check if farm exists first
        farm_check = supabase.table("farm").select("id, name").eq("id", farm_id).limit(1).execute()
        if not farm_check.data:
            return jsonify({"error": "Farm not found."}), 404
            
        farm_name = farm_check.data[0].get("name", "Unknown")
        
        # Delete the farm
        response = supabase.table("farm").delete().eq("id", farm_id).execute()
        
        if response.data:
            print(f"✅ DB: Deleted farm '{farm_name}' with id: {farm_id}")
            return jsonify({
                "message": f"Farm '{farm_name}' deleted successfully",
                "deleted_farm_id": farm_id
            }), 200
        else:
            return jsonify({"error": "Failed to delete farm."}), 500
            
    except Exception as e:
        print(f"❌ API Error (delete_farm): {str(e)}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500




@app.route('/analysis_files/<path:filename>')
def download_file(filename):
    """Serves files from the analysis_files directory."""
    return send_from_directory(
        os.path.join(app.root_path, 'analysis_files'), 
        filename, 
        as_attachment=True
    )


@app.route('/run-analysis', methods=['POST'])
def run_analysis():
    try:
        # Extract farm_id and coords from the request payload
        payload = request.get_json()
        farm_id = payload['farm_id']
        coords = payload['coords']
        

        # Call the main analysis function and pass the farm_id
        # This function now returns the URLs of the generated files
        file_urls = compute_and_export_from_bbox(coords, farm_id)

        # Return a success status along with the file URLs
        return jsonify({
            'status': 'success',
            'files': file_urls  # e.g., {'smi': '/analysis_files/farm1_smi_2025-07-08.tif', ...}
        })

    except Exception as e:
        # Log the full error for debugging on the server
        print(f"An error occurred during analysis: {e}")
        # Return a generic error message to the client
        return jsonify({'status': 'error', 'error': str(e)}), 500


# Function to run Flask with proper ngrok setup
def run_flask_with_ngrok():
    """
    Run Flask app with proper ngrok setup for Google Colab
    """
    try:
        # Install pyngrok if not already installed
        import subprocess
        import sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyngrok", "-q"])

        from pyngrok import ngrok

        # Set ngrok auth token
        ngrok.set_auth_token("2xRBK9klNrfGlODyvnRUw7YMyc8_6aQDyP3CL7UDNJWnbJCaG")

        # Start ngrok tunnel
        public_url = ngrok.connect(5001)
        print(f"🌐 Public URL: {public_url}")
        print(f"🌐 Use this URL as your API_BASE_URL: {public_url}")

        # Start Flask app
        print("🚀 Starting Flask app...")
        app.run(host='0.0.0.0', port=5001, debug=False)

    except Exception as e:
        print(f"❌ Error setting up ngrok: {e}")
        print("🔄 Falling back to regular Flask app (local only)")
        app.run(host='0.0.0.0', port=5001, debug=False)


def run_flask_local():
    """
    Run Flask app locally without ngrok
    """
    print("🚀 Starting Flask app locally...")
    print("📍 App will be available at: http://localhost:5003")
    app.run(host='0.0.0.0', port=5003, debug=True)

if __name__ == '__main__':
    print("🚀 Starting Flask app with Supabase...")
   
    test_supabase_connection()

    # Ensure GDAL is available for other libraries
    try:
        print(f"✅ GDAL version for Python: {gdal.__version__}")
    except Exception as e_gdal:
        print(f"⚠️ GDAL Python bindings might not be fully configured: {e_gdal}")

    # run_flask_with_ngrok()

    # Option 2: Run locally without ngrok (uncomment to use)
    run_flask_local()
