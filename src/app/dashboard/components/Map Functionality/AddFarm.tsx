// import { createFarm } from "@/app/actions/actions";
// import dynamic from "next/dynamic";

// const MapLeaflet = dynamic(() => import("./Map Leaflet"), { ssr: false });

const AddFarm = ({
  lat = -1.286389,
  long = 36.817223,
}: {
  lat: number;
  long: number;
}) => {
  return (
    <>
      {/* <MapLeaflet
        drawFunction={createFarm}
        lat={lat}
        long={long}
        height={300}
      /> */}
      <p>{lat}</p>
      <p>{long}</p>
    </>
  );
};

export default AddFarm;
