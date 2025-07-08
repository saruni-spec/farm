import { Tractor, Users } from "lucide-react";
import { getAllFarmers, getAllFarms } from "../actions/actions";

// --- Page Components ---
const DashboardPage = async () => {
  const farmCount = (await getAllFarms()).length;
  const farmerCount = (await getAllFarmers()).length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Farms"
          value={farmCount}
          icon={<Tractor size={24} />}
        />
        <StatCard
          title="Total Farmers"
          value={farmerCount}
          icon={<Users size={24} />}
        />
        {/* You can add more StatCards here as your app grows */}
      </div>
    </div>
  );
};

// --- Reusable Components ---
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default DashboardPage;
