import { getAllFarmers } from "@/app/actions/actions";

const UsersPage = async () => {
  const data = await getAllFarmers();

  const farmers = data.map((farmer) => ({
    ...farmer,
    profile: Array.isArray(farmer.profile) ? farmer.profile : [farmer.profile],
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Farmers (Users)</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Profile ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Join Date
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {farmers.map((farmer) => (
              <tr
                key={farmer.profile_id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  {farmer.profile[0].first_name} {farmer.profile[0].last_name}
                </td>
                <td className="py-3 px-4 font-mono text-sm">
                  {farmer.profile_id}
                </td>
                <td className="py-3 px-4">
                  {new Date(farmer.profile[0].created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
