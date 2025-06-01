import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

//Geoman styles
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';


import DrawControl from './Draw Control'
import MapUpdater from './Map Updater'
import GeoJsonDisplay from './GeoJsonDisplay'
import type { FeatureCollection } from "geojson"

const MapLeaflet = ({lat = -1.286389, long = 36.817223, height = 350, geoData, error, onDrawFinish} : { lat: number; long: number; height?: number; geoData?: FeatureCollection; error?: string | null; onDrawFinish: (bbox: number[], geoJson: FeatureCollection) => void;  }) => 
{
  const position: [number, number] = [lat, long]
  const [mounted, setMounted] = useState(false)

  useEffect(() => 
  {
    setMounted(true)
    L.Icon.Default.mergeOptions(
    {
      iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
      iconUrl: 'leaflet/dist/images/marker-icon.png',
      shadowUrl: 'leaflet/dist/images/marker-shadow.png',
    })
  }, [])

  if (!mounted) return null

  return (
    <div style={{ height: `${height}px`, width: '100%' }} className="relative z-0">
      <MapContainer center={position} zoom={16} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <MapUpdater lat={lat} long={long} />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View (Esri)">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <DrawControl onDrawFinish={onDrawFinish}/>

        {
          geoData && <GeoJsonDisplay geoData={geoData}/>
        }
      </MapContainer>

      {
        error && 
        <p className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded">{error}</p>
      }
    </div>
  )
}

export default MapLeaflet
