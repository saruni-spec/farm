import {
  Heart,
  Target,
  Droplets,
  CloudSun,
  Microscope,
  Smartphone,
} from "lucide-react";

const KeyFeatures = () => {
  const features = [
    {
      title: "Crop Health Tracking",
      description:
        "Identify diseased or stressed crop zones early. Get AI-driven treatment suggestions to protect your harvest.",
      icon: Heart,
    },
    {
      title: "Yield Estimation",
      description:
        "Predict harvest yields with 75%+ accuracy using AI and satellite data for better resource planning.",
      icon: Target,
    },
    {
      title: "Irrigation Recommendations",
      description:
        "Soil moisture maps and smart irrigation recommendations reduce water waste by up to 15%.",
      icon: Droplets,
    },
    {
      title: "Weather Forecasting",
      description:
        "5-day localized forecasts and real-time alerts for each farm to prepare for changing conditions.",
      icon: CloudSun,
    },
    {
      title: "Soil Analysis",
      description:
        "Soil organic carbon estimation and fertilizer recommendations for optimal soil health.",
      icon: Microscope,
    },
    {
      title: "Mobile Access",
      description:
        "Get insights via mobile app or WhatsApp integration—no complex logins required.",
      icon: Smartphone,
    },
  ];

  return (
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Background pattern inspired by tea plantation rows */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Key Farm Management Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to optimize your tea farm operations in one
            powerful platform
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 mb-4 group-hover:from-green-500 group-hover:to-green-600 group-hover:shadow-lg">
                    <IconComponent
                      className="text-green-600 group-hover:text-white transition-colors duration-300"
                      size={32}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Feature highlight bar */}
                <div className="h-1 w-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full group-hover:w-full transition-all duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
