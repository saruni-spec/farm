"use client";

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer';
import { LayersControl } from 'react-leaflet/LayersControl';
import { useEffect, useState } from 'react';
import * as L from "leaflet"
import 'leaflet-draw';

import DrawControl from './DrawControl';

// Nairobi coordinates
const position: [number, number] = [-1.286389, 36.817223];

const MapLeaflet = () => 
{
  const [mounted, setMounted] = useState(false)
  useEffect(() => 
  {
    setMounted(true)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
      iconUrl: 'leaflet/dist/images/marker-icon.png',
      shadowUrl: 'leaflet/dist/images/marker-shadow.png',
    });
  }, []);
  if (!mounted) return null; // Don't render until after mount
  return (
    <div className="w-full h-[350px]">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <LayersControl position="topright">
                {/* OpenStreetMap */}
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </LayersControl.BaseLayer>

                {/* Esri Satellite */}
                <LayersControl.BaseLayer name="Satellite View (Esri)">
                    <TileLayer attribution="Tiles &copy; Esri &mdash; Source: Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"/>
                </LayersControl.BaseLayer>
            </LayersControl>
            <DrawControl />
        </MapContainer>
    </div>
  );
};

export default MapLeaflet;
