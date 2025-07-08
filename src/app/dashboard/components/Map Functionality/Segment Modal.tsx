"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { feature } from "@/types/geometry";

import { LatLngTuple } from "leaflet";

const getBoundsFromFeature = (feature: feature): LatLngTuple => 
{
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") 
    {
        const coords = geometry.coordinates[0]; // Outer ring
        return [coords[0][1], coords[0][0]]; // [lat, lng]
    }

    if (geometry.type === "MultiPolygon") 
    {
        const coords = geometry.coordinates[0][0]; // First polygon
        return [coords[0][1], coords[0][0]]; // [lat, lng]
    }

    // Default fallback
    return [0, 0];
};



interface SegmentModalProps 
{
  feature: feature;
  onClose: () => void;
  onDelete: () => void;
  onSave: () => void;
}

const SegmentModal = ({ feature, onClose, onDelete, onSave }: SegmentModalProps) => 
{
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-[9999] flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
                {/* Mini map */}
                <div className="h-64 w-full mb-4 rounded overflow-hidden">
                <MapContainer style={{ height: "100%", width: "100%" }} zoom={18} center={getBoundsFromFeature(feature)} scrollWheelZoom={false} attributionControl={false} zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors'/>
                    <GeoJSON data={feature} style={{color: "#FFA500", weight: 2, fillColor: "#FFA500", fillOpacity: 0.4,}}/>
                </MapContainer>
                </div>

                <h2 className="text-lg font-semibold mb-2">Segment Options</h2>
                <p className="mb-4">Would you like to save or delete this segment?</p>

                <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={onSave}>Save</button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onDelete}>Delete</button>
                    <button className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default SegmentModal;
