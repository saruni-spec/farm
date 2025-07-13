import { useEffect } from "react";
import { useMap } from "react-leaflet";
import * as L from "leaflet";
import useDashboardStore from "@/stores/useDashboardStore";

const LegendControl = () => {
  const map = useMap();
  const { analysisLegend, showLegend } = useDashboardStore();

  useEffect(() => {
    let control = null;

    // Only create control if showLegend is true and there's data
    if (showLegend && analysisLegend.length > 0) {
      const legendContainer = L.DomUtil.create("div", "leaflet-control-legend");
      L.DomEvent.disableClickPropagation(legendContainer);
      L.DomEvent.disableScrollPropagation(legendContainer);

      // Style the container - made much smaller
      legendContainer.style.backgroundColor = "white";
      legendContainer.style.border = "2px solid rgba(0,0,0,0.2)";
      legendContainer.style.borderRadius = "6px";
      legendContainer.style.padding = "8px";
      legendContainer.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
      legendContainer.style.fontSize = "12px";
      legendContainer.style.lineHeight = "1.2";
      legendContainer.style.borderColor = "rgb(229, 231, 235)"; // border-gray-200
      legendContainer.style.minWidth = "120px";
      legendContainer.style.maxWidth = "180px";

      // Create legend content using DOM manipulation
      const createLegendContent = () => {
        // Main title - smaller
        const title = L.DomUtil.create("h3", "", legendContainer);
        title.innerHTML = "Analysis Legend";
        title.style.margin = "0 0 6px 0";
        title.style.fontSize = "14px";
        title.style.fontWeight = "600";
        title.style.color = "rgb(31, 41, 55)"; // text-gray-800

        // Create legend items from store data
        analysisLegend.forEach((legend, index) => {
          const legendDiv = L.DomUtil.create("div", "", legendContainer);
          legendDiv.style.marginBottom =
            index === analysisLegend.length - 1 ? "0" : "8px";

          // // Legend title - smaller
          // const legendTitle = L.DomUtil.create("div", "", legendDiv);
          // legendTitle.innerHTML = legend.title;
          // legendTitle.style.fontWeight = "500";
          // legendTitle.style.color = "rgb(55, 65, 81)"; // text-gray-700
          // legendTitle.style.marginBottom = "4px";
          // legendTitle.style.fontSize = "12px";

          // Colors and labels container - vertical layout
          const colorsContainer = L.DomUtil.create("div", "", legendDiv);
          colorsContainer.style.display = "flex";
          colorsContainer.style.flexDirection = "column";
          colorsContainer.style.alignItems = "center";
          colorsContainer.style.gap = "4px";

          // Colors container
          const colorsDiv = L.DomUtil.create("div", "", colorsContainer);
          colorsDiv.style.display = "flex";
          colorsDiv.style.gap = "2px";

          // Create color boxes - smaller
          legend.colors.forEach((color) => {
            const colorBox = L.DomUtil.create("div", "", colorsDiv);
            colorBox.style.width = "20px";
            colorBox.style.height = "8px";
            colorBox.style.backgroundColor = color;
            colorBox.style.border = "1px solid rgb(209, 213, 219)"; // border-gray-300
          });

          // Labels - below colors
          const labelsSpan = L.DomUtil.create("span", "", colorsContainer);
          labelsSpan.innerHTML = legend.labels;
          labelsSpan.style.fontSize = "10px";
          labelsSpan.style.color = "rgb(75, 85, 99)"; // text-gray-600
          labelsSpan.style.textAlign = "center";
        });

        // Footer note - smaller
        const footerDiv = L.DomUtil.create("div", "", legendContainer);
        footerDiv.style.marginTop = "6px";
        footerDiv.style.paddingTop = "6px";
        footerDiv.style.borderTop = "1px solid rgb(229, 231, 235)"; // border-gray-200

        const footerText = L.DomUtil.create("p", "", footerDiv);
        footerText.innerHTML = "Toggle layers using the layer control.";
        footerText.style.fontSize = "9px";
        footerText.style.color = "rgb(107, 114, 128)"; // text-gray-500
        footerText.style.margin = "0";
        footerText.style.textAlign = "center";
      };

      createLegendContent();

      control = new L.Control({ position: "bottomright" });
      control.onAdd = () => {
        return legendContainer;
      };

      control.addTo(map);
    }

    return () => {
      if (control) {
        map.removeControl(control);
      }
    };
  }, [map, analysisLegend, showLegend]); // Dependencies include store data

  return null;
};

export default LegendControl;
