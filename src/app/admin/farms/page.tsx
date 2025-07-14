"use client";

import { deleteFarm, getAllFarms } from "@/app/actions/actions";
import useDashboardStore from "@/stores/useDashboardStore";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { feature } from "@/types/geometry";
import dynamic from "next/dynamic";

const FarmsMap = dynamic(() => import("./FarmsMap"), {
  ssr: false,
});

const FarmsPage = () => {
  const [farms, setFarms] = useState<feature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalFarms, setTotalFarms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setSelectedFarm, selectedFarm } = useDashboardStore();
  const fetchFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const { data, count } = await getAllFarms(offset, itemsPerPage);
      setFarms(data || []);
      setTotalFarms(count || 0);
    } catch (err: unknown) {
      console.error("Error fetching farms:", err);
      setError((err as Error)?.message || "Failed to fetch farms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalFarms / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteFarm = async (
    e: React.MouseEvent<HTMLButtonElement>,
    farmId: string
  ) => {
    e.stopPropagation();
    await deleteFarm(farmId);

    fetchFarms();
    setSelectedFarm(undefined);
  };

  // New function to handle GeoJSON download
  const handleDownloadGeoJSON = () => {
    if (selectedFarm) {
      try {
        // Create a GeoJSON object from the selected farm
        // The 'feature' type already extends GeoJSON.Feature, so it should be directly usable.
        const geoJsonData = {
          type: "FeatureCollection",
          features: [selectedFarm],
        };

        const fileName = `${selectedFarm.name || "unnamed_farm"}_${
          selectedFarm.id
        }.geojson`;
        const jsonString = JSON.stringify(geoJsonData, null, 2); // Pretty print JSON

        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: "application/json" });

        // Create a temporary URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create a temporary link element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName; // Set the download filename
        document.body.appendChild(link); // Append to body (required for Firefox)
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Remove the link
        URL.revokeObjectURL(url); // Clean up the URL object
      } catch (error) {
        console.error("Error downloading GeoJSON:", error);
        // You might want to show a user-friendly error message here
      }
    } else {
      console.warn("No farm selected for download.");
      // You might want to show a message to the user that no farm is selected
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-12 w-full"></div>
        </div>
      ))}
    </div>
  );

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Farms
                  </h1>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Total: {totalFarms}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {loading && (
                <div className="space-y-4">
                  <LoadingSkeleton />
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Error: {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && farms.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    No farms found
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get started by adding your first farm.
                  </p>
                </div>
              )}

              {!loading && !error && farms.length > 0 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="block sm:hidden space-y-3">
                    {farms.map((farm) => (
                      <div
                        key={farm.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer"
                        onClick={() => setSelectedFarm(farm)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mr-3">
                              <span className="text-white font-medium text-xs">
                                {farm.name
                                  ? farm.name.charAt(0).toUpperCase()
                                  : "F"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {farm.name || "Unnamed Farm"}
                              </div>
                              <div className="text-xs text-gray-500 ">
                                ID: {farm.id}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) =>
                              handleDeleteFarm(e, farm.id as string)
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(farm.created_at!).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Farm Name
                          </th>
                          <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Farm ID
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {farms.map((farm, index) => (
                          <tr
                            key={farm.id}
                            className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                            onClick={() => setSelectedFarm(farm)}
                          >
                            <td className="px-4 lg:px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
                                  <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                    <span className="text-white font-medium text-xs lg:text-sm">
                                      {farm.name
                                        ? farm.name.charAt(0).toUpperCase()
                                        : "F"}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-3 lg:ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {farm.name || "Unnamed Farm"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4">
                              <div className="text-xs lg:text-sm text-gray-500 cursor-pointer text-wrap">
                                {farm.id}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">{currentPage}</p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                              onClick={handlePreviousPage}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Previous</span>
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            {getPaginationRange().map((pageNumber) =>
                              pageNumber === "..." ? (
                                <span
                                  key={pageNumber}
                                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={pageNumber}
                                  onClick={() =>
                                    handlePageClick(pageNumber as number)
                                  }
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    pageNumber === currentPage
                                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {pageNumber}
                                </button>
                              )
                            )}
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Next</span>
                              <svg
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              {selectedFarm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-2 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-lg font-bold text-blue-800 truncate">
                        {selectedFarm.farmer?.profile?.first_name}{" "}
                        {selectedFarm.farmer?.profile?.last_name}:{" "}
                        {selectedFarm.name || "Unnamed Farm"}
                      </h3>
                    </div>
                    <div className="flex flex-col space-y-2 flex-shrink-0">
                      <button
                        onClick={handleDownloadGeoJSON}
                        className="inline-flex items-center justify-center w-8 h-8 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        title="Download GeoJSON"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) =>
                          handleDeleteFarm(e, selectedFarm.id as string)
                        }
                        className="inline-flex items-center justify-center w-8 h-8 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        title="Delete Farm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700">
                    Created{" "}
                    {new Date(
                      selectedFarm?.created_at as string
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {!selectedFarm && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center text-gray-600">
                  Click on a farm row to view its details and location on the
                  map.
                </div>
              )}
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <div
                  style={{
                    height: `calc(100vh - 200px)`,
                    minHeight: "400px",
                    maxHeight: "600px",
                    width: "100%",
                  }}
                  className="relative z-0"
                >
                  <FarmsMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmsPage;
