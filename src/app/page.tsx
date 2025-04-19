import { ArrowRight } from "lucide-react";
import Link from "next/link";
import styles from "../styles/Home.module.css"
import { Button } from "@/components/ui/button";

export default function Home() 
{
  return (
    <div className={`${styles.background} min-h-screen w-screen flex flex-col`}>
      <div className="flex justify-start p-2 lg:p-4">
        <p className="text-white font-semibold text-xl md:text-2xl">FarmSawa</p>
      </div>
      <div className="flex flex-1 justify-center items-center flex-col text-center text-white  space-y-12 lg:space-y-20 p-2 md:p-0">
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold">Farm Management System</h2>
        <p className="text-xl lg:text-3xl">Connecting farmers for better productivity</p>

        <div className="flex justify-center gap-12">
          <Link href="/get_started" >
            <Button variant={"landing"} size={"landing"}>Get started <ArrowRight size={18}/></Button>
          </Link>
          <Link href="/" >
            <Button variant={"landing"} size={"landing"}>Book demo</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
