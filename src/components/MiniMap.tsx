/* eslint-disable @typescript-eslint/no-explicit-any */
// components/MiniMap.tsx
"use client"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"

const MiniMap = ({ farm }: { farm: any }) => 
{
  const centerLat = farm?.geometry?.coordinates[0][0][1]
  const centerLng = farm?.geometry?.coordinates[0][0][0]

  return (
    <MapContainer style={{ height: "200px", width: "100%" }} center={[centerLat, centerLng]} zoom={35} scrollWheelZoom={true}>
      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <GeoJSON data={farm} style={() => ({color: "#228B22", weight: 2, fillColor: "#7CFC00", fillOpacity: 0.4})}/>
    </MapContainer>
  )
}

export default MiniMap