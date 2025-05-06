"use server";

import { neonClient as client } from "../../../database/dbconn";
import { Position } from "geojson";

export const saveFarm = async (
  coordinates: Position[][],
  farmer_id: number,
  name: string
) => {
  // Ensure the polygon is closed by repeating the first coordinate at the end
  if (coordinates[0][0] !== coordinates[0][coordinates[0].length - 1]) {
    coordinates[0].push(coordinates[0][0]);
  }

  // Convert coordinates to WKT format
  const wkt = `POLYGON((${coordinates[0]
    .map((coord) => `${coord[0]} ${coord[1]}`)
    .join(", ")}))`;

  await client.query(
    "INSERT INTO farms (farmer_id, name, geom) VALUES ($1, $2, ST_GeomFromText($3, 4326))",
    [farmer_id, name, wkt]
  );
};

export const getFarms = async () => {
  const farms = await client.query(
    "SELECT id, name, ST_AsGeoJSON(geom) as geometry FROM farms"
  );
  return farms.rows;
};
