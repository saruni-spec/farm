import React from "react";
import useDashboardStore from "@/stores/useDashboardStore";

const AnalysisLegend = () => {
  const { analysisLegend, showLegend } = useDashboardStore();
  if (!showLegend || analysisLegend.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Analysis Legend
      </h3>

      {analysisLegend.map((legend, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="font-medium text-gray-700 mb-2">{legend.title}</div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {legend.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="w-8 h-3 border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">{legend.labels}</span>
          </div>
        </div>
      ))}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Toggle layers using the layer control on the map to compare different
          analysis results.
        </p>
      </div>
    </div>
  );
};

export default AnalysisLegend;
