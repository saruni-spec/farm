import Navbar from "@/components/ui/Landing page/Nav";
import Hero from "@/components/ui/Landing page/Hero";
import Problem from "@/components/ui/Landing page/Problem";
import Solution from "@/components/ui/Landing page/Solution";
import KeyFeatures from "@/components/ui/Landing page/Key Features";
import Stakeholders from "@/components/ui/Landing page/Stakeholders";
import Footer from "@/components/ui/Landing page/Footer";
const Home = () => 
{
  return ( 
    <div className="bg-white min-h-dvh text-black">
      <Navbar/>
      <Hero/>
      <Problem/>
      <Solution/>
      <KeyFeatures/>
      <Stakeholders/>
      <Footer/>
    </div>
  );
}
 
export default Home;