import os
import datetime
import ee
import geemap
from google.oauth2 import service_account
from shapely.geometry import box, mapping, shape
from supabase import create_client, Client


service_account_email = 'my-earth-engine-access-api@ee-avantgiske.iam.gserviceaccount.com'
key_file = 'API_mine.json'
credentials = service_account.Credentials.from_service_account_file(
    key_file,
    scopes=['https://www.googleapis.com/auth/earthengine']
)
ee.Initialize(credentials)


# --- Supabase Configuration ---
SUPABASE_URL = "https://ounttrkvhnvhzfgtyklo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bnR0cmt2aG52aHpmZ3R5a2xvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzMwNDk5OCwiZXhwIjoyMDYyODgwOTk4fQ.AFjO6VdBYgm-tK5VxxXkGhzQ2w1X2XLnf69maEj7WbQ"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
print("✅ Supabase client initialized successfully.")



# --- NEW: Function to Check for Existing Analysis ---
def check_existing_analysis(farm_id: str) -> dict | None:
    """
    Checks if an analysis for the given farm was already run today.
    If so, it fetches and returns the file URLs. Otherwise, returns None.
    """
    today_iso = datetime.date.today().isoformat()
    print(f"🔎 Checking for existing analysis for farm {farm_id} on {today_iso}...")

    try:
        # Step 1: Find the latest analysis record for the farm on the current date
        analysis_response = supabase.table('farm_analysis') \
            .select('id') \
            .eq('farm_id', farm_id) \
            .eq('analysis_date', today_iso) \
            .order('created_at', desc=True) \
            .limit(1) \
            .execute()

        if not analysis_response.data:
            print("ℹ️ No record found for today.")
            return None

        analysis_id = analysis_response.data[0]['id']
        print(f"✅ Found existing analysis record with ID: {analysis_id}")

        # Step 2: Fetch all associated file records for that analysis
        files_response = supabase.table('analysis_files') \
            .select('file_type, file_url') \
            .eq('analysis_id', analysis_id) \
            .execute()

        if not files_response.data:
            print("⚠️ Analysis record found, but no associated files. Will re-run.")
            return None
            
        # Step 3: Reconstruct the file URLs dictionary
        file_urls = {item['file_type']: item['file_url'] for item in files_response.data}
        
        # Ensure we have all the expected files before returning cached results
        if all(key in file_urls for key in ['smi', 'stress', 'soc']):
            print("✅ All files found. Returning cached results.")
            return file_urls
        else:
            print("⚠️ Incomplete file set found. Re-running analysis for consistency.")
            return None

    except Exception as e:
        print(f"❌ Error checking for existing analysis: {e}")
        return None


# --- Database Interaction Logic ---
def store_analysis_in_db(farm_id: str, file_urls: dict):
    """
    Stores analysis metadata and file URLs in Supabase.
    """
    try:
        # 1. Insert into farm_analysis table and get the new analysis ID
        analysis_record = supabase.table('farm_analysis').insert({
            'farm_id': farm_id,
            'analysis_date': datetime.date.today().isoformat()
        }).execute()

        if not analysis_record.data:
            raise Exception("Failed to create analysis record in database.")

        analysis_id = analysis_record.data[0]['id']
        print(f"📄 Created new analysis record with ID: {analysis_id}")

        # 2. Prepare records for the analysis_files table
        files_to_insert = [
            {
                'analysis_id': analysis_id,
                'file_type': file_type,
                'file_url': url
            }
            for file_type, url in file_urls.items()
        ]

        # 3. Insert all file records in a single batch
        supabase.table('analysis_files').insert(files_to_insert).execute()
        print(f"🔗 Stored {len(files_to_insert)} file URLs in the database.")

    except Exception as e:
        print(f"❌ Database Error: {e}")
        # Optionally, re-raise the exception if you want the API to fail
        raise e

def export_image(image: ee.Image, region: dict, farm_id: str, analysis_type: str) -> str:
    """
    Exports an EE image with a unique filename and returns its server path.
    """
    analysis_files_dir = os.path.join(os.getcwd(), 'analysis_files')
    os.makedirs(analysis_files_dir, exist_ok=True)
    
    date_str = datetime.date.today().isoformat()
    # Using consistent short names for files (e.g., farmID_smi_YYYY-MM-DD.tif)
    filename = f"{farm_id}_{analysis_type}_{date_str}.tif"
    path = os.path.join(analysis_files_dir, filename)
    
    print(f"⚙️  Generating file: {filename}")
    geemap.ee_export_image(image, filename=path, scale=10, region=region, file_per_band=False)
    
    server_path = f"/analysis_files/{filename}"
    print(f"✅ Exported to: {path}")
    return server_path



# --- Main Orchestration Function---
def compute_and_export_from_bbox(farm_geojson:dict, farm_id: str) -> dict:
    """
    First checks for existing analysis. If none, computes all indices,
    exports them, stores in DB, and returns file URLs.
    """
    # ⭐️ CACHING CHECK: Check for existing results first
    existing_files = check_existing_analysis(farm_id)
    if existing_files:
        return existing_files

    print("🚀 Starting new analysis computation...")
    aoi = get_geometry(farm_geojson)
    start_date, end_date = find_available_date_range(aoi)

    if not start_date:
        print("❌ No images found in last 90 days for the selected AOI.")
        raise Exception("No suitable satellite imagery found for the selected date range.")

    ndvi, ndre, ci = compute_indices(aoi, start_date, end_date)
    smi = compute_smi(aoi, start_date, end_date)
    stress = compute_pca_stress(ndvi, ndre, ci, aoi)
    soc = compute_soc(ndvi, ndre, ci, smi)
    
    file_urls = {}

    # Export each layer and collect its URL using consistent short names
    file_urls['smi'] = export_image(smi, aoi, farm_id, "smi")
    file_urls['stress'] = export_image(stress, aoi, farm_id, "stress")
    file_urls['soc'] = export_image(soc, aoi, farm_id, "soc")

    # Store the new results in the database
    store_analysis_in_db(farm_id, file_urls)

    return file_urls



def get_geometry(geojson_geometry: dict):
    """
    Converts a GeoJSON geometry dictionary to an Earth Engine ee.Geometry object.
    """
    # Use ee.Geometry.Polygon, ee.Geometry.MultiPolygon, etc., directly from GeoJSON
    # The ee.Geometry constructor can often directly consume a GeoJSON dictionary.
    return ee.Geometry(geojson_geometry)


def find_available_date_range(aoi):
    day_windows = [14, 30, 60, 90]
    for days in day_windows:
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=days)
        s2_filtered = (
            ee.ImageCollection("COPERNICUS/S2")
            .filterBounds(aoi)
            .filterDate(str(start_date), str(end_date))
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
        )
        image_count = s2_filtered.size().getInfo()
        print(f"📅 Checking last {days} days: Found {image_count} image(s).")

        if image_count > 0:
            print(f"✅ Using {days}-day window: {start_date} to {end_date}")
            return str(start_date), str(end_date)

    print("❌ No suitable Sentinel-2 images found in last 90 days.")
    return None, None


def compute_smi(aoi, start_date, end_date):
    s1 = ee.ImageCollection('COPERNICUS/S1_GRD') \
        .filterBounds(aoi) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV')) \
        .filter(ee.Filter.eq('instrumentMode', 'IW')) \
        .select('VV')

    s1_median = s1.median()
    vv_norm = s1_median.unitScale(-25, 0).clamp(0, 1)
    smi = vv_norm.rename('SMI').clip(aoi)
    return smi


def compute_indices(aoi, start_date, end_date):
    s2 = ee.ImageCollection('COPERNICUS/S2') \
        .filterBounds(aoi) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) \
        .median().clip(aoi)
        

    ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI')
    ndre = s2.normalizedDifference(['B8', 'B5']).rename('NDRE')
    ci = s2.expression('(B8 / B2)', {'B8': s2.select('B8'), 'B2': s2.select('B2')}).rename('CI')
    return ndvi, ndre, ci


def compute_pca_stress(ndvi, ndre, ci, aoi): # aoi is the ee.Geometry of the farm

    image = ndvi.rename('NDVI').addBands([
        ndre.rename('NDRE'),
        ci.rename('CI')
    ])

    mean_dict = image.reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9,
        bestEffort=True
    )

    mean_image = ee.Image.constant([
        ee.Number(mean_dict.get('NDVI')),
        ee.Number(mean_dict.get('NDRE')),
        ee.Number(mean_dict.get('CI'))
    ]).rename(['NDVI', 'NDRE', 'CI'])

    centered = image.subtract(mean_image)
    array_image = centered.toArray()

    covar = array_image.reduceRegion(
        reducer=ee.Reducer.covariance(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9,
        bestEffort=True
    )

    covar_array = ee.Array(covar.get('array'))
    # IMPORTANT: Recheck Earth Engine PCA logic. For first PC, you typically take
    # the first column of the eigenvectors corresponding to the largest eigenvalue.
    # The previous slice(1, 0, 1).project([1]) might be correct, but let's ensure.
    # Often, eigens is [[eigenvalues], [eigenvectors]].
    # For PCA, you sort by eigenvalues (descending) and take corresponding eigenvectors.
    # For simplicity, if your current PCA logic is working, just ensure 'aoi' is used.
    eigens = covar_array.eigen() # This returns a tuple: (eigenvalues, eigenvectors)
    eigen_vectors = eigens.get(1) # Get the eigenvectors array

    # Assuming the first eigenvector (corresponding to the largest eigenvalue)
    # is what you want for PC1.
    # This might need adjustment based on how the eigenvectors are ordered by GEE.
    # Typically, GEE returns them in descending order of associated eigenvalues.
    pc1_vector = ee.Array(eigen_vectors.slice(0, 0, 1)).project([1]) # Get the first eigenvector as a 1D array


    ndvi_weight = pc1_vector.get([0])
    ndre_weight = pc1_vector.get([1])
    ci_weight = pc1_vector.get([2])

    weighted = ndvi.multiply(ndvi_weight) \
        .add(ndre.multiply(ndre_weight)) \
        .add(ci.multiply(ci_weight)) \
        .rename('PC1') \
        .clip(aoi) # Clip to the farm geometry

    minmax = weighted.reduceRegion(
        reducer=ee.Reducer.minMax(),
        geometry=aoi,
        scale=10,
        maxPixels=1e9,
        bestEffort=True
    )

    min_val = ee.Number(minmax.get('PC1_min'))
    max_val = ee.Number(minmax.get('PC1_max'))

    stress = weighted.subtract(min_val) \
        .divide(max_val.subtract(min_val)) \
        .multiply(100) \
        .rename('Crop_Stress_Percent') \
        .toFloat() \
        .clip(aoi) # Clip to the farm geometry

    return stress





def compute_crop_stress_percentage(lon, lat):
    point = ee.Geometry.Point([lon, lat])
    roi = get_geometry(lat, lon) 
    start_date, end_date = find_available_date_range(roi)
    if not start_date:
        print("No images found for Crop Stress!")
        return

    def select_bands(image):
        return image.select(['B4', 'B5', 'B8'])  

    s2 = (ee.ImageCollection('COPERNICUS/S2_SR')
          .filterBounds(roi)
          .filterDate(start_date, end_date)
          .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
          .map(select_bands)
          .median()
          .clip(roi))

    ndvi = s2.normalizedDifference(['B8', 'B4']).rename('NDVI')
    ndre = s2.normalizedDifference(['B8', 'B5']).rename('NDRE')
    ci = s2.expression('(B8 / B4) - 1', {'B8': s2.select('B8'), 'B4': s2.select('B4')}).rename('CI')

    def normalize(image, name):
        stats = image.reduceRegion(
            reducer=ee.Reducer.minMax(),
            geometry=roi,
            scale=10,
            bestEffort=True
        )
        min_val = ee.Number(stats.get(f'{name}_min'))
        max_val = ee.Number(stats.get(f'{name}_max'))
        range_val = max_val.subtract(min_val)
        return image.subtract(min_val).divide(range_val).clamp(0, 1).rename(f'{name}_norm')

    ndvi_norm = normalize(ndvi, 'NDVI')
    ndre_norm = normalize(ndre, 'NDRE')
    ci_norm = normalize(ci, 'CI')
    indices = ndvi_norm.addBands([ndre_norm, ci_norm])

    mean = indices.reduceRegion(ee.Reducer.mean(), roi, 10, bestEffort=True)
    std_dev = indices.reduceRegion(ee.Reducer.stdDev(), roi, 10, bestEffort=True)

    standardized = indices.subtract(ee.Image.constant(mean.values())).divide(ee.Image.constant(std_dev.values()))
    array_image = standardized.toArray()
    covar = array_image.reduceRegion(ee.Reducer.covariance(), roi, 10, bestEffort=True)
    covar_array = ee.Array(covar.get('array'))
    eigens = covar_array.eigen()
    eigen_vectors = eigens.slice(1, 1)
    pc1_vector = ee.Array(eigen_vectors.toList().get(0)).toList().flatten()

    weighted_stress = (ndvi_norm.multiply(ee.Number(pc1_vector.get(0)))
                        .add(ndre_norm.multiply(ee.Number(pc1_vector.get(1))))
                        .add(ci_norm.multiply(ee.Number(pc1_vector.get(2))))
                        .rename('Weighted_Stress'))

    min_stress = weighted_stress.reduceRegion(ee.Reducer.min(), roi, 10, bestEffort=True).get('Weighted_Stress')
    max_stress = weighted_stress.reduceRegion(ee.Reducer.max(), roi, 10, bestEffort=True).get('Weighted_Stress')

    stress_percentage = (weighted_stress.subtract(ee.Number(min_stress))
                         .divide(ee.Number(max_stress).subtract(ee.Number(min_stress)))
                         .clamp(0, 1)
                         .rename('Stress_Percentage'))

    analysis_files_dir = os.path.join(os.getcwd(), 'analysis_files')
    os.makedirs(analysis_files_dir, exist_ok=True)
    out_file = os.path.join(analysis_files_dir, 'crop_stress_percentage.tif')

    print(f"📥 Downloading Crop Stress Percentage GeoTIFF to: {out_file}")
    geemap.ee_export_image(
        ee_object=stress_percentage,
        filename=out_file,
        scale=10,
        region=roi,
        file_per_band=False
    )
    print("✅ Download complete!")





def compute_soc(ndvi, ndre, ci, smi):
    soc = ndvi.multiply(0.4).add(ndre.multiply(0.3)).add(ci.multiply(0.2)).add(smi.multiply(0.1)).rename('SOC')
    return soc.clip(ndvi.geometry()) 


def get_geometry_from_bbox(minx, miny, maxx, maxy):
    polygon = box(minx, miny, maxx, maxy)
    return mapping(polygon)




