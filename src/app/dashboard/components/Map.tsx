"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Expand, Plus } from "lucide-react";

import dynamic from "next/dynamic";
const MapLeaflet = dynamic(() => import("./Map Functionality/Map Leaflet"), {
  ssr: false,
});

const Map = ({
  lat = -1.286389,
  long = 36.817223,
  height = 500,
}: {
  lat: number;
  long: number;
  height?: number;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"save"}>
            <Plus size={16} />
            Add your farm
          </Button>
        </DialogTrigger>

        <DialogContent className="z-[9999] w-full">
          <DialogHeader>
            <DialogTitle>Add a new farm</DialogTitle>

            <DialogDescription>
              Create a new farm. Click save when you&apos;re done
            </DialogDescription>
          </DialogHeader>

          <AddFarm lat={lat} long={long} />

          <DialogFooter>
            <Button variant={"save"}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Field Map</h2>
        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
          <Expand />
        </button>
      </div>
      <MapLeaflet lat={lat} long={long} height={height} />
    </div>
  );
};

export default Map;
