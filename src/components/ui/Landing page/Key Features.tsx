const KeyFeatures = () => 
{
    const features = [
    {
        title: "Crop Health Tracking",
        description: "Identify diseased or stressed crop zones early. Get AI-driven treatment suggestions to protect your harvest.",
    },
    {
        title: "Yield Estimation",
        description: "Predict harvest yields with 75%+ accuracy using AI and satellite data for better resource planning.",
    },
    {
        title: "Irrigation Recommendations",
        description: "Soil moisture maps and smart irrigation recommendations reduce water waste by up to 15%.",
    },
    {
        title: "Weather Forecasting",
        description:
        "5-day localized forecasts and real-time alerts for each farm to prepare for changing conditions.",
    },
    {
        title: "Soil Analysis",
        description: "Soil organic carbon estimation and fertilizer recommendations for optimal soil health.",
    },
    // {
    //     title: "Mobile Access",
    //     description: "Get insights via mobile app or WhatsApp integration—no complex logins required.",
    // },
    ];
    return ( 
        <section id="features" className="py-8 text-gray-800">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">Key Farm Management Features</h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {
                        features.map(feature =>
                        {
                            return(
                                <div key={feature.title} className="bg-white p-6 rounded-lg shadow-md text-left">
                                    <h3 className="text-xl font-semibold text-green-700 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
     );
}
 
export default KeyFeatures;