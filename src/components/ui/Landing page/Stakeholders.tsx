// components/Stakeholders.tsx
const stakeholders = [
  {
    role: "Factory Managers",
    description:
      "Monitor multiple farms efficiently with regional performance insights and exportable reports.",
  },
  {
    role: "Extension Officers",
    description:
      "Guide farmers with data-driven recommendations and identify areas needing intervention.",
  },
  {
    role: "Tea Farmers",
    description:
      "Receive actionable insights via mobile app or WhatsApp for better farm management decisions.",
  },
];

// const testimonials = [
//     {
//         quote: "As a factory manager, I now have complete visibility across all our regions. The yield projections have transformed how we plan our logistics and staffing. What used to take days of field visits now happens at a glance on my dashboard.",
//         author: "Jacob Maina",
//         position: "Tea Factory Manager, Nandi Hills",
//     },
//     {
//         quote: "As a factory manager, I now have complete visibility across all our regions. The yield projections have transformed how we plan our logistics and staffing. What used to take days of field visits now happens at a glance on my dashboard.",
//         author: "Samuel Kipchoge",
//         position: "Tea Factory Manager, Tetu, Nyeri",
//     }
// ]

const Stakeholders = () => 
{
    return(
        <section id="stakeholders" className="pt-3 bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-5">Built for Every Stakeholder</h2>
                <div className="grid gap-8 md:grid-cols-3 mb-5">
                    {
                        stakeholders.map(stakeholder => 
                        {
                            return(
                                <div key={stakeholder.role} className="bg-gray-50 p-6 rounded-lg shadow-md text-left">
                                    <h3 className="text-xl font-semibold text-green-700 mb-2">{stakeholder.role}</h3>
                                    <p className="text-gray-600">{stakeholder.description}</p>
                                </div>
                            )
                        })
                    }
                </div>
                {/* <h2 className="text-3xl md:text-4xl font-bold text-green-800 mt-12 mb-4">Testimonials</h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {
                        testimonials.map(testimonial =>
                        {
                            return(
                                <div key={testimonial.author} className="p-6 rounded-lg shadow-md mb-5">
                                    <blockquote className="text-lg italic text-gray-700">“{testimonial.quote}”</blockquote>
                                    <p className="mt-4 text-green-700 font-semibold"> — {testimonial.author}, {testimonial.position}</p>
                                </div>
                            )
                        }
                        )
                    }
                    
                </div> */}
            </div>
        </section>
    );
}

export default Stakeholders;
