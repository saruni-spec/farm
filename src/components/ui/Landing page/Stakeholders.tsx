import { Factory, Users, Smartphone } from "lucide-react";

const stakeholders = [
  {
    role: "Factory Managers",
    description:
      "Monitor multiple farms efficiently with regional performance insights and exportable reports.",
    icon: Factory,
  },
  {
    role: "Extension Officers",
    description:
      "Guide farmers with data-driven recommendations and identify areas needing intervention.",
    icon: Users,
  },
  {
    role: "Tea Farmers",
    description:
      "Receive actionable insights via mobile app or WhatsApp for better farm management decisions.",
    icon: Smartphone,
  },
];

const Stakeholders = () => {
  return (
    <section
      id="stakeholders"
      className="py-20 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden"
    >
      {/* Organic background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built for Every Stakeholder
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our platform serves the entire tea farming ecosystem, from
            individual farmers to large factory operations
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {stakeholders.map((stakeholder, index) => {
            const IconComponent = stakeholder.icon;
            return (
              <div
                key={stakeholder.role}
                className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 text-center hover:bg-white/90"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="text-white" size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {stakeholder.role}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {stakeholder.description}
                  </p>
                </div>

                {/* Decorative accent */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-green-500/20 rounded-full group-hover:bg-green-500/40 transition-colors duration-300"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-400/20 rounded-full group-hover:bg-green-400/40 transition-colors duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Transform Your Tea Farming?
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join hundreds of farmers already using FarmSawa to increase
                their yields and profits
              </p>
              <button className="bg-white text-green-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stakeholders;
