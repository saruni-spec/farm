"use client"

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { LayersControl } from 'react-leaflet/LayersControl'
import { useEffect, useState } from 'react'
import * as L from 'leaflet'
import 'leaflet-draw'

import DrawControl from './Draw Control'
import MapUpdater from './Map Updater'

const MapLeaflet = ({ lat = -1.286389, long = 36.817223, height= 350 }: { lat: number; long: number; height?: number }) => 
{
  // Map coordinates
  const position: [number, number] = [lat, long]

  const [mounted, setMounted] = useState(false)

  useEffect(() => 
  {
    setMounted(true)
    // Update the icon options without deleting _getIconUrl
    L.Icon.Default.mergeOptions(
    {
      iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
      iconUrl: 'leaflet/dist/images/marker-icon.png',
      shadowUrl: 'leaflet/dist/images/marker-shadow.png',
    })
  }, [])

  if (!mounted) return null // Don't render until after mount

  return (
    <div style={{ height: `${height}px`, width: '100%' }} className={`relative z-0`}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <MapUpdater lat={lat} long={long} />
        <LayersControl position="topright">
          {/* OpenStreetMap */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>

          {/* Esri Satellite */}
          <LayersControl.BaseLayer name="Satellite View (Esri)">
            <TileLayer attribution="Tiles &copy; Esri &mdash; Source: Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>
        <DrawControl />
      </MapContainer>
    </div>
  )
}

export default MapLeaflet
