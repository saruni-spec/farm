const Problem = () => {
  const pageDetails = [
    {
      title: "Unpredictable Weather",
      text: "Climate change has made weather patterns harder to predict, causing unexpected droughts, floods, and frost that damage crops and reduce yield.",
    },
    {
      title: "Lack of Real-Time Farm Data",
      text: "Most farmers rely on outdated methods or guesswork to make decisions, leading to inefficiencies in irrigation, fertilization, and pest control.",
    },
    {
      title: "Pest and Disease Outbreaks",
      text: "Without early warning systems, tea plantations are vulnerable to pests and diseases that can spread rapidly and cause devastating losses.",
    },
    {
      title: "Low Market Access & Price Instability",
      text: "Many farmers lack access to reliable buyers and fair pricing, making it difficult to forecast income or scale their operations sustainably.",
    },
  ];

  return (
    <section
      id="problem"
      className="py-20 px-6 md:px-12 bg-gray-100 text-gray-800"
    >
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700">
          Challenges Facing Tea Farmers Today
        </h2>
        <p className="text-lg text-gray-600">
          Despite being a major source of income in many rural areas, tea
          farming continues to face significant challenges that reduce
          productivity and profitability.
        </p>
        <div className="grid gap-10 md:grid-cols-2 text-left mt-8">
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

export default Problem;
