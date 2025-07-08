"use client";

import { useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { feature } from "@/types/geometry";
import { LatLngTuple } from "leaflet";

const getBoundsFromFeature = (feature: feature): LatLngTuple => 
{
    const geometry = feature.geometry;

    if (geometry.type === "Polygon") {
        const coords = geometry.coordinates[0];
        return [coords[0][1], coords[0][0]];
    }

    if (geometry.type === "MultiPolygon") {
        const coords = geometry.coordinates[0][0];
        return [coords[0][1], coords[0][0]];
    }

    return [0, 0];
};

interface SegmentModalProps 
{
  feature: feature;
  onClose: () => void;
  onDelete: () => void;
  onSave: (name: string) => void;
}

const SegmentModal = ({ feature, onClose, onDelete, onSave }: SegmentModalProps) => 
{
    const [isSaving, setIsSaving] = useState(false);
    const [farmName, setFarmName] = useState("");

    const handleSaveClick = () => 
    {
        if (!isSaving) 
        {
            setIsSaving(true); // Show input field
        } 
        else 
        {
            onSave(farmName);  // Submit with name
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-[9999] flex items-center justify-center mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full">
                {/* Mini Map */}
                <div className="h-64 w-full mb-4 rounded overflow-hidden">
                    <MapContainer style={{ height: "100%", width: "100%" }} zoom={18} center={getBoundsFromFeature(feature)} scrollWheelZoom={false} attributionControl={false} zoomControl={false}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'/>
                        <GeoJSON data={feature} style={{color: "#FFA500", weight: 2, fillColor: "#FFA500", fillOpacity: 0.4,}}/>
                    </MapContainer>
                </div>

                <h2 className="text-lg font-semibold mb-2">Segment Options</h2>
                {
                    !isSaving 
                    ? 
                        <p className="mb-4">Would you like to save or delete this segment?</p> 
                    : 
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Farm Name</label>
                            <input type="text" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300" value={farmName} onChange={(e) => setFarmName(e.target.value)} placeholder="e.g. My Maize Farm"/>
                        </div>
                }

                <div className="flex justify-end gap-3">
                    {
                        !isSaving && 
                            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={handleSaveClick}>Save as Farm</button>
                    }

                    {
                        isSaving && 
                        (
                            <>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSaveClick} disabled={!farmName.trim()}>Confirm Save</button>
                                <button className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400" onClick={() => setIsSaving(false)}>Cancel</button>
                            </>
                        )
                    }

                    {
                        !isSaving && 
                        (
                            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={onDelete}>Delete</button>
                        )
                    }
                    {
                        !isSaving && (
                            <button className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                            onClick={onClose}>Cancel</button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default SegmentModal;
