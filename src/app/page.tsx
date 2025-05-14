import {
  ArrowRight,
  Leaf,
  Satellite,
  Brain,
  Smartphone,
  BarChart3,
  CloudSunRain,
  Droplets,
  Map,
  LineChart,
  Cloud,
} from "lucide-react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { Button } from "@/components/ui/button";

export default function Home() {
  const features = [
    {
      icon: <Leaf size={48} className="text-green-600 mb-4" />,
      title: "Crop Health Tracking",
      description:
        "Identify diseased or stressed crop zones early. Get AI-driven treatment suggestions to protect your harvest.",
    },
    {
      icon: <LineChart size={48} className="text-green-600 mb-4" />,
      title: "Yield Estimation",
      description:
        "Predict harvest yields with 75%+ accuracy using AI and satellite data for better resource planning.",
    },
    {
      icon: <Droplets size={48} className="text-green-600 mb-4" />,
      title: "Water Management",
      description:
        "Soil moisture maps and smart irrigation recommendations reduce water waste by up to 15%.",
    },
    {
      icon: <CloudSunRain size={48} className="text-green-600 mb-4" />,
      title: "Weather Forecasting",
      description:
        "5-day localized forecasts and real-time alerts for each farm to prepare for changing conditions.",
    },
    {
      icon: <Map size={48} className="text-green-600 mb-4" />,
      title: "Soil Analysis",
      description:
        "Soil organic carbon estimation and fertilizer recommendations for optimal soil health.",
    },
    {
      icon: <Smartphone size={48} className="text-green-600 mb-4" />,
      title: "Mobile Access",
      description:
        "Get insights via mobile app or WhatsApp integration—no complex logins required.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Hero Section */}
      <div className={`${styles.background} min-h-screen flex flex-col`}>
        <div className="flex justify-start p-4 lg:p-6">
          <div className="flex items-center">
            <Leaf className="h-6 w-6 md:h-8 md:w-8 text-green-300 mr-2" />
            <p className="text-white font-semibold text-2xl md:text-3xl">
              FarmSawa
            </p>
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center flex-col text-center text-white space-y-8 md:space-y-12 lg:space-y-16 p-4 md:p-0">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Revolutionize Your Tea Production with{" "}
            <br className="hidden md:block" /> AI-Powered Insights for Nandi
            County
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-3xl">
            Leverage cutting-edge AI and satellite imagery for precise crop
            health monitoring, yield forecasting, water management, and
            localized weather alerts—all tailored for Nandi&apos;s tea estates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-12 mt-8">
            <Link href="/get_started">
              <Button
                variant={"landingGreen"}
                size={"landingLg"}
                className="px-8 py-4 text-lg"
              >
                Explore Features <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/book-demo">
              <Button
                variant={"landingSecondary"}
                size={"landingLg"}
                className="px-8 py-4 text-lg"
              >
                Book Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <section className="py-16 lg:py-24 bg-slate-50 text-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Modernizing Tea Farming in Nandi
          </h2>
          <p className="text-lg lg:text-xl max-w-2xl mx-auto">
            Struggling with unpredictable yields, crop diseases, or inefficient
            water use? FarmSawa provides the clarity and foresight you need,
            transforming traditional challenges into data-driven opportunities.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <p className="text-3xl font-bold text-green-600">75%+</p>
              <p className="text-gray-600">Yield prediction accuracy</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <p className="text-3xl font-bold text-green-600">15%</p>
              <p className="text-gray-600">Reduction in water usage</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <p className="text-3xl font-bold text-green-600">5 days</p>
              <p className="text-gray-600">Satellite data refresh rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 text-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
            Intelligent Tea Farming, Simplified
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {/* Step 1 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <Satellite size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Satellite Data</h3>
              <p className="text-gray-600">
                Utilizing Sentinel-1 & -2 for comprehensive farm views.
              </p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <Brain size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Algorithms process data for patterns and predictions.
              </p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <Smartphone size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Actionable Insights
              </h3>
              <p className="text-gray-600">
                Real-time alerts & maps on mobile or web.
              </p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
              <BarChart3 size={48} className="text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Improved Decisions</h3>
              <p className="text-gray-600">
                Proactive choices for irrigation, health, and yield.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 lg:py-24 bg-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-green-800 mb-12">
            Key Farm Management Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${styles.featureCard} bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-green-800 to-green-700 text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Built for Every Stakeholder
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-700/50 p-6 rounded-lg text-center backdrop-blur">
              <Cloud className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h3 className="text-xl font-semibold mb-2">Factory Managers</h3>
              <p className="text-green-100">
                Monitor multiple farms efficiently with regional performance
                insights and exportable reports
              </p>
            </div>
            <div className="bg-green-700/50 p-6 rounded-lg text-center backdrop-blur">
              <Map className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h3 className="text-xl font-semibold mb-2">Extension Officers</h3>
              <p className="text-green-100">
                Guide farmers with data-driven recommendations and identify
                areas needing intervention
              </p>
            </div>
            <div className="bg-green-700/50 p-6 rounded-lg text-center backdrop-blur">
              <Smartphone className="w-12 h-12 mx-auto mb-4 text-green-300" />
              <h3 className="text-xl font-semibold mb-2">Tea Farmers</h3>
              <p className="text-green-100">
                Receive actionable insights via mobile app or WhatsApp for
                better farm management decisions
              </p>
            </div>
          </div>

          {/* User Story */}
          <div className="mt-16 bg-white/10 p-8 rounded-lg backdrop-blur border border-white/20">
            <div className="flex items-start">
              <div className="hidden md:block bg-green-500 rounded-full p-3 mr-4">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Real Impact from Real Farmers
                </h3>
                <p className="italic text-green-100 mb-4">
                  &quot;As a factory manager, I now have complete visibility
                  across all our regions. The yield projections have transformed
                  how we plan our logistics and staffing. What used to take days
                  of field visits now happens at a glance on my dashboard.&quot;
                </p>
                <p className="text-sm text-green-200">
                  — Jacob Maina, Tea Factory Manager, Nandi Hills
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-green-800 mb-8">
            Powered by Advanced Technology
          </h2>
          <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            Our system leverages satellite imagery from Sentinel-1 and
            Sentinel-2, combined with AI algorithms to deliver precise insights
            for your tea farm
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Sentinel-1 (Radar Imagery)
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  5–20 meters resolution
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  6–12 days revisit time
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  All-weather, day/night imaging
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  VV, VH polarizations
                </li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-green-700 mb-4">
                Sentinel-2 (Multispectral)
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  13 spectral bands
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  10–60 meters resolution
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  5-day revisit time
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>{" "}
                  290 km swath width
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            Target Success Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white px-6 py-8 rounded-lg shadow-xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  75%+
                </div>
                <div className="text-gray-700">
                  Accuracy in yield prediction
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white px-6 py-8 rounded-lg shadow-xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  80%+
                </div>
                <div className="text-gray-700">Farmer satisfaction rate</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white px-6 py-8 rounded-lg shadow-xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  15%
                </div>
                <div className="text-gray-700">
                  Reduction in unnecessary irrigation
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white px-6 py-8 rounded-lg shadow-xl text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  50%
                </div>
                <div className="text-gray-700">
                  App adoption by lead farmers in year one
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className={`${styles.background} py-16 lg:py-24 text-white text-center`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to transform your tea farm?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join tea farmers across Nandi County who are making data-driven
            decisions and improving their yields
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/get_started">
              <Button
                variant="landingGreen"
                size="landingLg"
                className="px-8 py-4 text-lg"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="landingSecondary"
                size="landingLg"
                className="px-8 py-4 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-200 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Leaf className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">FarmSawa</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link href="/features" className="hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Pricing
              </Link>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} FarmSawa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
