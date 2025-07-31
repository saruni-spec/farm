import { Satellite, CloudRain, Droplet, TrendingUp } from "lucide-react";

const Solution = () => {
  const pageDetails = [
    {
      title: "AI-Powered Crop Monitoring",
      text: "Our platform uses satellite imagery and machine learning to detect crop stress, disease, and nutrient deficiencies early—before they cause serious damage.",
      icon: Satellite,
    },
    {
      title: "Precision Weather Forecasting",
      text: "Receive hyperlocal weather predictions and alerts tailored to your farm's location to optimize planting, irrigation, and harvesting schedules.",
      icon: CloudRain,
    },
    {
      title: "Smart Irrigation Guidance",
      text: "Get real-time soil moisture data and watering suggestions to conserve water and maximize crop yield, reducing waste and costs.",
      icon: Droplet,
    },
    {
      title: "Market Intelligence & Recommendations",
      text: "We connect farmers to reliable markets, offer price trend analysis, and help optimize harvest timing to boost profitability and reduce post-harvest loss.",
      icon: TrendingUp,
    },
  ];

  return (
    <section
      id="solution"
      className="py-20 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden"
    >
      {/* Organic background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-0 left-1/2 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Farmers with Smart, Data-Driven Decisions
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            FarmSawa leverages AI and satellite technology to provide farmers
            with real-time insights and predictive analytics for sustainable tea
            farming.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {pageDetails.map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <div
                key={detail.title}
                className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white/90"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="text-white" size={28} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-3">
                      {detail.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {detail.text}
                    </p>
                  </div>
                </div>

                {/* Decorative accent line */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-500 rounded-t-2xl"></div>

                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Solution;
