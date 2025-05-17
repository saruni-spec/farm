const Solution = () => {
  const pageDetails = [
    {
      title: "AI-Powered Crop Monitoring",
      text: "Our platform uses satellite imagery and machine learning to detect crop stress, disease, and nutrient deficiencies early—before they cause serious damage.",
    },
    {
      title: "Precision Weather Forecasting",
      text: "Receive hyperlocal weather predictions and alerts tailored to your farm's location to optimize planting, irrigation, and harvesting schedules.",
    },
    {
      title: "Smart Irrigation Guidance",
      text: "Get real-time soil moisture data and watering suggestions to conserve water and maximize crop yield, reducing waste and costs.",
    },
    {
      title: "Market Intelligence & Recommendations",
      text: "We connect farmers to reliable markets, offer price trend analysis, and help optimize harvest timing to boost profitability and reduce post-harvest loss.",
    },
  ];

  return (
    <section
      id="solution"
      className="py-20 px-6 md:px-12 bg-white text-gray-800"
    >
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700">
          Empowering Farmers with Smart, Data-Driven Decisions
        </h2>
        <p className="text-lg text-gray-600">
          FarmSawa leverages AI and satellite technology to provide farmers with
          real-time insights and predictive analytics for sustainable tea
          farming.
        </p>
        <div className="grid gap-10 md:grid-cols-2 text-left pt-8">
          {pageDetails.map((detail) => (
            <div key={detail.title} className="p-5">
              <h3 className="font-semibold text-xl text-green-700 mb-3">
                {detail.title}
              </h3>
              <p className="text-gray-600">{detail.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;
