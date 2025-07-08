/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { feature } from "@/types/geometry";
import useDashboardStore from "@/stores/useDashboardStore";
import SegmentModal from "./Segment Modal";
import { toast } from "react-toastify";

const GeoJsonDisplay = ({ geoData }: { geoData: feature[] }) => 
{
  const map = useMap();
  const { setSelectedFarm } = useDashboardStore();

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

  // ✅ Initial draw
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
          <SegmentModal feature={clickedFeature} onClose={handleCloseModal} onDelete={handleDelete} onSave={() => 
          {
            console.log("Save segment", clickedFeature);
            handleCloseModal();
          }}/>
        )
      }
    </>
  );
};

export default GeoJsonDisplay;
