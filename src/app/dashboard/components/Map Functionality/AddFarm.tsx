const AddFarm = ({
  lat = -1.286389,
  long = 36.817223,
}: {
  lat: number;
  long: number;
}) => {
  return (
    <>
      <p>{lat}</p>
      <p>{long}</p>
    </>
  );
};

export default AddFarm;
