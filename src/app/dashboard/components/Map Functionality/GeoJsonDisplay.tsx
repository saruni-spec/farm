/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { feature } from "@/types/geometry";
import useDashboardStore from "@/stores/useDashboardStore";
import SegmentModal from "./Segment Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"

const GeoJsonDisplay = ({ geoData }: { geoData: feature[] }) => 
{
  const map = useMap();
  const router = useRouter()
  const { setSelectedFarm } = useDashboardStore();
  const getFarms = useDashboardStore((state) => state.getFarms)
  const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL
  const layersRef = useRef<L.Layer[]>([]);
  const originalSegmentsRef = useRef<feature[] | null>(null);
  const [clickedFeature, setClickedFeature] = useState<feature | null>(null);

  // ✅ Draw segments from given data
  const drawSegments = (data: feature[]) => 
  {
    if (!map || !data?.length) return;

    // Remove previous layers
    layersRef.current.forEach((layer) => map.removeLayer(layer));
    layersRef.current = [];

    let pane = map.getPane("segmentsPane");
    if (!pane) 
    {
      map.createPane("segmentsPane");
      pane = map.getPane("segmentsPane");
    }
    if (pane) pane.style.zIndex = "450";

    const newLayers: L.Layer[] = [];

    data.forEach((feat) => 
    {
      feat["type"] = "Feature";

      const layer = L.geoJSON(feat, 
      {
        pane: "segmentsPane",
        style: 
        {
          color: "#FFA500",
          weight: 2,
          fillColor: "#FFA500",
          fillOpacity: 0.4,
        },
        onEachFeature: (_f, l) => 
        {
          l.on("click", () => 
          {
            setClickedFeature(feat);
            setSelectedFarm(feat);
          });
        },
      }).addTo(map);

      newLayers.push(layer);
    });

    layersRef.current = newLayers;

    const group = L.featureGroup(newLayers);
    if (group.getBounds().isValid()) 
    {
      map.fitBounds(group.getBounds(), 
      {
        animate: false,
        padding: [10, 10],
      });
    }
  };

  //Initial draw
  useEffect(() => 
  {
    if (geoData?.length && !originalSegmentsRef.current) 
    {
      originalSegmentsRef.current = [...geoData];
      drawSegments(geoData);
    }
  }, [geoData, map]);

  const handleCloseModal = () => 
  {
    setClickedFeature(null);
    if (originalSegmentsRef.current) 
    {
      drawSegments(originalSegmentsRef.current);
    }
  };

  //Handle delete
  const handleDelete = () => 
  {
    if (!clickedFeature || !originalSegmentsRef.current) return;

    // Remove the clicked feature by ID or geometry
    originalSegmentsRef.current = originalSegmentsRef.current.filter((f) => f.id !== clickedFeature.id);

    setClickedFeature(null);
    toast.success("Segment deleted successfully!")
    drawSegments(originalSegmentsRef.current); // Redraw with updated list
  };

  return (
    <>
      {
        clickedFeature && (
          <SegmentModal feature={clickedFeature} onClose={handleCloseModal} onDelete={handleDelete} onSave={async farmName => 
          {
            try
            {
              const response = await fetch(`${backendURL}/api/farms/${clickedFeature?.id}`,
              {
                method: "PUT",
                headers: 
                {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({name: farmName})
              })
              if(!response.ok) throw new Error("Failed to save segment")
              const result = await response.json()
              toast.success(result.message || "Segment saved successfully")
              getFarms(router)
              handleCloseModal()
            }
            catch (error)
            {
              console.log(error )
              toast.error("Saving segment failed. Try again later!")
            }
          }}/>
        )
      }
    </>
  );
};

export default GeoJsonDisplay;
