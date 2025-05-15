import Link from "next/link"
import { ArrowRight } from "lucide-react"
import styles from "@/styles/Home.module.css"

const Hero = () => 
{
    const buttonStyling = "w-full md:w-auto px-6 py-4 rounded-full font-medium shadow-lg transition duration-300"
    
    return (
        <section className={`pt-16 ${styles.background} flex justify-center items-center`}>
            <div className="flex flex-col items-center text-center text-white px-6 md:px-0 max-w-6xl space-y-6 md:space-y-10">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold leading-tight">Revolutionize Your Tea Production with AI-Powered Insights</h2>
                <p className="text-base md:text-2xl text-gray-100 max-w-xl">Leverage cutting-edge AI and satellite imagery for precise crop health monitoring, yield forecasting, water management, and localized weather alerts.</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 pt-4 w-full mb-2 md:mb-0">
                    <Link href={"/account/login"} className="w-full md:w-auto">
                        <button className={`${buttonStyling} bg-green-600 hover:bg-green-700 flex justify-center items-center gap-3`}>Explore features <ArrowRight/></button>
                    </Link>
                    {/* <Link href={"/"} className="w-full md:w-auto">
                        <button className={`${buttonStyling} bg-white text-black`}>Book demo</button>
                    </Link> */}
                </div>
            </div>
        </section>
    )
}

export default Hero
