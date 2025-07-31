import Navbar from "@/components/ui/Nav";
import Hero from "@/components/ui/Landing page/Hero";
import Problem from "@/components/ui/Landing page/Problem";
import Solution from "@/components/ui/Landing page/Solution";
import Footer from "@/components/ui/Landing page/Footer";
import KeyFeatures from "@/components/ui/Landing page/KeyFeatures";
import Stakeholders from "@/components/ui/Landing page/Stakeholders";

export default function Home() {
  const landingLinks = [
    {
      url: "/",
      title: "Home",
    },
    {
      url: "#problem",
      title: "Problem",
    },
    {
      url: "#solution",
      title: "Solution",
    },
    {
      url: "#features",
      title: "Key Features",
    },
    {
      url: "#footer",
      title: "Contact",
    },
  ];
  return (
    <div className="bg-white min-h-dvh text-black">
      <Navbar navLinks={landingLinks} />
      <Hero />
      <Problem />
      <Solution />
      <KeyFeatures />
      <Stakeholders />
      <Footer />
    </div>
  );
}
