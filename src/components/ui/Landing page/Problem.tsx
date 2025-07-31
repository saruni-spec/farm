import { Cloud, TrendingDown, Bug, DollarSign } from "lucide-react";

const Problem = () => {
  const pageDetails = [
    {
      title: "Unpredictable Weather",
      text: "Climate change has made weather patterns harder to predict, causing unexpected droughts, floods, and frost that damage crops and reduce yield.",
      icon: Cloud,
    },
    {
      title: "Lack of Real-Time Farm Data",
      text: "Most farmers rely on outdated methods or guesswork to make decisions, leading to inefficiencies in irrigation, fertilization, and pest control.",
      icon: TrendingDown,
    },
    {
      title: "Pest and Disease Outbreaks",
      text: "Without early warning systems, tea plantations are vulnerable to pests and diseases that can spread rapidly and cause devastating losses.",
      icon: Bug,
    },
    {
      title: "Low Market Access & Price Instability",
      text: "Many farmers lack access to reliable buyers and fair pricing, making it difficult to forecast income or scale their operations sustainably.",
      icon: DollarSign,
    },
  ];

  return (
    <section id="problem" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Challenges Facing Tea Farmers Today
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Despite being a major source of income in many rural areas, tea
            farming continues to face significant challenges that reduce
            productivity and profitability.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {pageDetails.map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <div
                key={detail.title}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  transform: "translateY(0px)",
                }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <IconComponent className="text-white" size={24} />
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

                {/* Subtle hover accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problem;
