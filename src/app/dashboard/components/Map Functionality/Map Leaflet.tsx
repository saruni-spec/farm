import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import DrawControl from './Draw Control';
import MapUpdater from './Map Updater';

const MapLeaflet = ({ lat = -1.286389, long = 36.817223, height = 350 }: { lat: number; long: number; height?: number }) => 
{
  const position: [number, number] = [lat, long];
  const [mounted, setMounted] = useState(false);
  const [geoData, setGeoData] = useState();
  const [error, setError] = useState<string | null>(null);

  const handleDrawFinish = (bbox: number[]) => {
    const segmentationURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    fetch(`${segmentationURL}/segment`, 
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bbox }),
    })
    .then(res => res.json())
    .then(data => 
    {
      console.log("Fetched GeoJSON:", data);
      setGeoData(data);
      setError(null);
    })
    .catch(err =>
    {
      console.error("Error fetching segmentation:", err);
      setError("Failed to process area. Please try again.");
    });
  };

  useEffect(() => {
    setMounted(true);
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
      iconUrl: 'leaflet/dist/images/marker-icon.png',
      shadowUrl: 'leaflet/dist/images/marker-shadow.png',
    });
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ height: `${height}px`, width: '100%' }} className="relative z-0">
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <MapUpdater lat={lat} long={long} />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View (Esri)">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <DrawControl onDrawFinish={handleDrawFinish} />

        {geoData && (
          <GeoJSON data={geoData} style={{ color: "#00aaff", weight: 2 }} />
        )}
      </MapContainer>

      {
        error && 
        (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded">
            {error}
          </div>
        )
      }
    </div>
  );
};

export default MapLeaflet;
