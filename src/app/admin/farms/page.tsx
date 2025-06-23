import { getAllFarms } from "@/app/actions/actions";

const FarmsPage = async () => {
  const farms = await getAllFarms();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Farms Management
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Farm Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Farm ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Farmer ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {farms.map((farm) => (
              <tr
                key={farm.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{farm.name || "N/A"}</td>
                <td className="py-3 px-4 font-mono text-sm">{farm.id}</td>
                <td className="py-3 px-4 font-mono text-sm">
                  {farm.farmer_id}
                </td>
                <td className="py-3 px-4">
                  {new Date(farm.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmsPage;
