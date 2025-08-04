/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { X, Download, Droplets, Leaf, Cloud, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import jsPDF from "jspdf";
import { feature } from "@/types/geometry";

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: feature;
  analysisData: {
    cropStress: Array<{ cropStress: any; date: string }>;
    soilMoisture: Array<{ soilMoisture: any; date: string }>;
    soilCarbon: Array<{ soilCarbon: any; date: string }>;
    weather: Array<{ weather: any; date: string }>;
  };
}

const AnalysisModal = ({
  isOpen,
  onClose,
  farm,
  analysisData,
}: AnalysisModalProps) => {
  const [activeTab, setActiveTab] = useState("crop");
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const tabs = [
    { id: "crop", label: "Crop Analysis", icon: Leaf, color: "green" },
    { id: "moisture", label: "Soil Moisture", icon: Droplets, color: "blue" },
    { id: "carbon", label: "Soil Carbon", icon: FileText, color: "amber" },
    { id: "weather", label: "Weather", icon: Cloud, color: "purple" },
  ];

  const formatDateForChart = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const prepareChartData = (data: any[], valueKey: string) => {
    return data.map((item, index) => ({
      date: formatDateForChart(item.date),
      value:
        typeof item[valueKey] === "object"
          ? Object.values(item[valueKey])[0]
          : item[valueKey],
      index,
    }));
  };

  // Enhanced data processing functions
  const extractNumericValue = (value: any): number => {
    if (typeof value === "number") return value;
    if (typeof value === "object" && value !== null) {
      const numericValues = Object.values(value).filter(
        (v) => typeof v === "number"
      );
      return numericValues.length > 0 ? (numericValues[0] as number) : 0;
    }
    return parseFloat(value) || 0;
  };

  const calculateStats = (data: any[], valueKey: string) => {
    const values = data.map((item) => extractNumericValue(item[valueKey]));
    const validValues = values.filter((v) => !isNaN(v));

    if (validValues.length === 0)
      return { min: 0, max: 0, avg: 0, trend: "stable" };

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const avg =
      validValues.reduce((sum, val) => sum + val, 0) / validValues.length;

    // Simple trend calculation
    const firstHalf = validValues.slice(0, Math.floor(validValues.length / 2));
    const secondHalf = validValues.slice(Math.floor(validValues.length / 2));
    const firstAvg =
      firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    let trend = "stable";
    if (secondAvg > firstAvg * 1.1) trend = "increasing";
    else if (secondAvg < firstAvg * 0.9) trend = "decreasing";

    return { min, max, avg, trend };
  };

  const generateStructuredPDF = async (type: "individual" | "all") => {
    setIsDownloading(true);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Helper functions
    const addHeader = (title: string, subtitle?: string) => {
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, margin, yPosition);
      yPosition += 10;

      if (subtitle) {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(subtitle, margin, yPosition);
        yPosition += 8;
      }
      yPosition += 5;
    };

    const addSection = (title: string) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, margin, yPosition);
      yPosition += 8;
    };

    const addText = (text: string, indent: number = 0) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(text, contentWidth - indent);
      pdf.text(lines, margin + indent, yPosition);
      yPosition += lines.length * 5 + 2;
    };

    const addTable = (headers: string[], rows: string[][]) => {
      const rowHeight = 8;
      const headerHeight = 10;
      const colWidth = contentWidth / headers.length;

      // Check if table fits on current page
      if (
        yPosition + headerHeight + rows.length * rowHeight >
        pageHeight - margin
      ) {
        pdf.addPage();
        yPosition = margin;
      }

      // Draw headers
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, contentWidth, headerHeight, "F");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");

      headers.forEach((header, index) => {
        pdf.text(header, margin + index * colWidth + 2, yPosition + 6);
      });

      yPosition += headerHeight;

      // Draw rows
      pdf.setFont("helvetica", "normal");
      rows.forEach((row, rowIndex) => {
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, yPosition, contentWidth, rowHeight, "F");
        }

        row.forEach((cell, cellIndex) => {
          pdf.text(cell, margin + cellIndex * colWidth + 2, yPosition + 5);
        });

        yPosition += rowHeight;
      });

      yPosition += 5;
    };

    // Generate Cover Page
    addHeader(
      "Agricultural Analysis Report",
      `Farm: ${farm?.name || "Unknown Farm"}`
    );

    // Farm Information
    addSection("Farm Information");
    addText(`Farm Name: ${farm?.name || "N/A"}`);
    addText(`Farm ID: ${farm?.farmer_id || "N/A"}`);
    addText(
      `Created: ${
        farm?.created_at
          ? new Date(farm?.created_at).toLocaleDateString()
          : "N/A"
      }`
    );

    if (farm?.farmer?.profile) {
      addText(
        `Farmer: ${farm?.farmer?.profile.first_name} ${farm?.farmer?.profile.last_name}`
      );
      addText(
        `Farmer Since: ${new Date(
          farm?.farmer?.profile.created_at
        ).toLocaleDateString()}`
      );
    }

    addText(`Report Generated: ${new Date().toLocaleDateString()}`);

    // Executive Summary
    yPosition += 10;
    addSection("Executive Summary");

    const metrics = [
      {
        key: "cropStress",
        data: analysisData.cropStress,
        name: "Crop Stress",
        unit: "index",
      },
      {
        key: "soilMoisture",
        data: analysisData.soilMoisture,
        name: "Soil Moisture",
        unit: "%",
      },
      {
        key: "soilCarbon",
        data: analysisData.soilCarbon,
        name: "Soil Carbon",
        unit: "ppm",
      },
      {
        key: "weather",
        data: analysisData.weather,
        name: "Weather Conditions",
        unit: "index",
      },
    ];

    metrics.forEach((metric) => {
      const stats = calculateStats(metric.data, metric.key);
      addText(
        `${metric.name}: ${
          metric.data.length
        } readings, Average: ${stats.avg.toFixed(2)} ${metric.unit}, Trend: ${
          stats.trend
        }`
      );
    });

    if (type === "all") {
      // Generate detailed sections for all metrics
      metrics.forEach((metric) => {
        pdf.addPage();
        yPosition = margin;

        addHeader(`${metric.name} Analysis`);

        const stats = calculateStats(metric.data, metric.key);
        addText(`Data Points: ${metric.data.length}`);
        addText(`Average Value: ${stats.avg.toFixed(2)} ${metric.unit}`);
        addText(`Minimum Value: ${stats.min.toFixed(2)} ${metric.unit}`);
        addText(`Maximum Value: ${stats.max.toFixed(2)} ${metric.unit}`);
        addText(`Trend: ${stats.trend}`);

        // Data table
        yPosition += 5;
        addSection("Raw Data");

        if (metric.data.length > 0) {
          const headers = ["Date", "Time", `Value (${metric.unit})`];
          const rows = metric.data.map((item) => {
            const date = new Date(item.date);
            const value = extractNumericValue(
              item[metric.key as keyof typeof item]
            );
            return [
              date.toLocaleDateString(),
              date.toLocaleTimeString(),
              value.toFixed(2),
            ];
          });

          // Split into chunks if too many rows
          const maxRowsPerPage = 25;
          for (let i = 0; i < rows.length; i += maxRowsPerPage) {
            const chunk = rows.slice(i, i + maxRowsPerPage);
            addTable(headers, chunk);

            if (i + maxRowsPerPage < rows.length) {
              pdf.addPage();
              yPosition = margin;
              addSection(`${metric.name} Data (continued)`);
            }
          }
        } else {
          addText("No data available for this metric.");
        }
      });
    } else {
      // Individual metric report
      const currentMetric = metrics.find((m) => {
        switch (activeTab) {
          case "crop":
            return m.key === "cropStress";
          case "moisture":
            return m.key === "soilMoisture";
          case "carbon":
            return m.key === "soilCarbon";
          case "weather":
            return m.key === "weather";
          default:
            return false;
        }
      });

      if (currentMetric) {
        pdf.addPage();
        yPosition = margin;

        addHeader(`${currentMetric.name} Detailed Analysis`);

        const stats = calculateStats(currentMetric.data, currentMetric.key);
        addText(`Data Points: ${currentMetric.data.length}`);
        addText(`Average Value: ${stats.avg.toFixed(2)} ${currentMetric.unit}`);
        addText(`Minimum Value: ${stats.min.toFixed(2)} ${currentMetric.unit}`);
        addText(`Maximum Value: ${stats.max.toFixed(2)} ${currentMetric.unit}`);
        addText(`Trend: ${stats.trend}`);

        yPosition += 5;
        addSection("Raw Data");

        if (currentMetric.data.length > 0) {
          const headers = ["Date", "Time", `Value (${currentMetric.unit})`];
          const rows = currentMetric.data.map((item) => {
            const date = new Date(item.date);
            const value = extractNumericValue(
              item[currentMetric.key as keyof typeof item]
            );
            return [
              date.toLocaleDateString(),
              date.toLocaleTimeString(),
              value.toFixed(2),
            ];
          });

          addTable(headers, rows);
        } else {
          addText("No data available for this metric.");
        }
      }
    }

    // Add page numbers
    const totalPages = pdf.internal.pages.length;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );
    }

    // Save the PDF
    const fileName =
      type === "all"
        ? `${farm?.name || "farm"}_complete_analysis_report.pdf`
        : `${farm?.name || "farm"}_${activeTab}_analysis_report.pdf`;

    pdf.save(fileName);
    setIsDownloading(false);
  };

  const renderChart = () => {
    switch (activeTab) {
      case "crop":
        const cropData = prepareChartData(
          analysisData.cropStress,
          "cropStress"
        );
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                name="Crop Stress"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "moisture":
        const moistureData = prepareChartData(
          analysisData.soilMoisture,
          "soilMoisture"
        );
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Soil Moisture"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "carbon":
        const carbonData = prepareChartData(
          analysisData.soilCarbon,
          "soilCarbon"
        );
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#f59e0b"
                name="Soil Carbon"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "weather":
        const weatherData = prepareChartData(analysisData.weather, "weather");
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={weatherData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                name="Weather Conditions"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return <div>No data available</div>;
    }
  };

  const getActiveTabData = () => {
    switch (activeTab) {
      case "crop":
        return analysisData.cropStress;
      case "moisture":
        return analysisData.soilMoisture;
      case "carbon":
        return analysisData.soilCarbon;
      case "weather":
        return analysisData.weather;
      default:
        return [];
    }
  };

  const activeTabData = getActiveTabData();
  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div
        ref={reportRef}
        className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[95vh] max-h-[800px] overflow-hidden flex"
      >
        {/* Left Panel */}
        <div className="w-1/3 flex flex-col border-r border-gray-200 bg-gray-50">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Analysis Report
                </h2>
                <p className="text-gray-600">{farm?.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 flex-grow">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Analyses
            </h3>
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-left font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-${tab.color}-100 text-${tab.color}-700 shadow-sm`
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer with Download Actions */}
          <div className="p-6 border-t border-gray-200 mt-auto">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => generateStructuredPDF("individual")}
                className={`flex w-full items-center justify-center gap-2 px-4 py-2 bg-${currentTab?.color}-600 text-white rounded-lg hover:bg-${currentTab?.color}-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={activeTabData.length === 0 || isDownloading}
              >
                <Download size={18} />
                {isDownloading
                  ? "Generating..."
                  : `Download ${currentTab?.label} Report`}
              </button>
              <button
                onClick={() => generateStructuredPDF("all")}
                className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-wait"
                disabled={isDownloading}
              >
                <Download size={18} />
                {isDownloading
                  ? "Generating Complete Report..."
                  : "Download Complete Analysis Report"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Chart Display */}
        <div className="w-2/3 flex flex-col p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-gray-700">
            {currentTab && (
              <currentTab.icon
                size={24}
                className={`text-${currentTab.color}-500`}
              />
            )}
            {currentTab?.label} Trends
          </h3>
          <div className="flex-grow flex items-center justify-center w-full h-full">
            {activeTabData.length > 0 ? (
              renderChart()
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">No Data Available</p>
                <p>There is no data to display for this analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {isDownloading && (
        <div className="absolute top-5 right-5 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg animate-pulse">
          Generating structured PDF report...
        </div>
      )}
    </div>
  );
};

export default AnalysisModal;
