"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  FileText,
} from "lucide-react";

export default function CropManagementPage() {
  // Initial crop data
  const crops = [
    { id: 1, name: "Maize" },
    { id: 2, name: "Coffee Beries" },
    { id: 3, name: "Legumes" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Filter crops based on search query
  const filteredCrops = crops.filter((crop) =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Crops</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            New Crop Type
          </Button>
          <Button variant="outline">Add Planting</Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search"
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {showEmptyState ? (
        <div className="border rounded-lg p-12 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Leaf className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No crops yet?</h2>
          <p className="text-gray-500 mb-4">
            Add a new crop type and it will show up here.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4">Plantings</h2>
          <div className="border rounded-lg">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                className="flex justify-between items-center p-4 border-b last:border-b-0"
              >
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {crop.name}
                </a>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Displaying {filteredCrops.length} records
          </div>
        </>
      )}

      {/* Controls for demo purposes */}
      <div className="mt-8 p-4 border-t">
        <Button
          onClick={() => setShowEmptyState(!showEmptyState)}
          variant="outline"
        >
          Toggle {showEmptyState ? "Populated State" : "Empty State"}
        </Button>
      </div>
    </div>
  );
}
