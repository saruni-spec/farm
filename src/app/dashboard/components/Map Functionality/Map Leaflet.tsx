"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { LayersControl } from "react-leaflet/LayersControl";
import { Polygon } from "react-leaflet/Polygon";
import { Popup } from "react-leaflet/Popup";
import { useEffect, useState } from "react";
import * as L from "leaflet";
import "leaflet-draw";

import DrawControl from "./Draw Control";
import MapUpdater from "./Map Updater";
import { getFarmsByFarmerId } from "@/app/actions/actions";
import { Position } from "geojson";

interface Farm {
  id: number;
  name: string;
  geom: {
    type: string;
    crs: {
      type: string;
      properties: {
        name: string;
      };
    };
    coordinates: [[[number, number]]];
  };
}

const MapLeaflet = ({
  drawFunction = () => Promise.resolve([]),
  lat = -1.286389,
  long = 36.817223,
  height = 350,
}: {
  drawFunction: (
    farmName: string,
    farmGeometry: Position[][]
  ) => Promise<any[]>;
  lat: number;
  long: number;
  height?: number;
}) => {
  const position: [number, number] = [lat, long];

  const [mounted, setMounted] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch farms
  const fetchFarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedFarms = await getFarmsByFarmerId();
      setFarms(fetchedFarms || []);
    } catch (err) {
      console.error("Error fetching farms:", err);
      setError("Failed to load farms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "leaflet/dist/images/marker-icon-2x.png",
      iconUrl: "leaflet/dist/images/marker-icon.png",
      shadowUrl: "leaflet/dist/images/marker-shadow.png",
    });

    fetchFarms();
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div
        style={{ height: `${height}px`, width: "100%" }}
        className="flex items-center justify-center"
      >
        Loading Farms...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ height: `${height}px`, width: "100%" }}
        className="flex items-center justify-center text-red-500"
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{ height: `${height}px`, width: "100%" }}
      className={`relative z-0`}
    >
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* MapUpdater will change the view if lat/long props change */}
        <MapUpdater lat={lat} long={long} />

        <LayersControl position="topright">
          {/* OpenStreetMap */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Esri Satellite */}
          <LayersControl.BaseLayer name="Satellite View (Esri)">
            <TileLayer
              attribution="Tiles &copy; Esri &mdash; Source: Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Render the fetched farms */}
        {farms.map((farm) => {
          try {
            const geoJson = farm.geom;

            if (
              geoJson.type === "Polygon" &&
              geoJson.coordinates &&
              geoJson.coordinates.length > 0
            ) {
              // ST_AsGeoJSON returns coordinates in [longitude, latitude] order.
              // react-leaflet's Polygon expects positions in [latitude, longitude] order.
              // The coordinates property for a Polygon is an array of rings.
              // We are using the first ring (index 0) which is the exterior ring.
              const polygonPositions: [number, number][] =
                geoJson.coordinates[0].map((coord: [number, number]) => [
                  coord[1],
                  coord[0],
                ]);

              // Basic path options for the polygon
              const polygonOptions = {
                color: "green",
                fillColor: "#90ee90",
                fillOpacity: 0.5,
              };

              return (
                <Polygon
                  key={farm.id}
                  positions={polygonPositions}
                  pathOptions={polygonOptions}
                >
                  <Popup>{farm.name}</Popup>
                </Polygon>
              );
            }
            // If geometry is not a valid Polygon or has no coordinates, don't render
            return null;
          } catch (parseError) {
            console.error(
              `Error parsing GeoJSON for farm ${farm.id}:`,
              parseError
            );
            return null;
          }
        })}

        <DrawControl drawFunction={drawFunction} fetchFarms={fetchFarms} />
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;
