import { Facebook, Twitter, Linkedin, Instagram, Send } from "lucide-react";
import Link from "next/link";

const Footer = () => 
{
    const quickLinks = [
        {
            title: "Home",
            url: "/"
        },
        {
            title: "Problem",
            url: "#problem"
        },
        {
            title: "Solution",
            url: "#solution"
        },
        {
            title: "Key Features",
            url: "#features"
        },
    ]

    const resources = [
        {
            title: "Documentation",
            url: "/documentation"
        },
        {
            title: "Research",
            url: "/research"
        },
        {
            title: "Blog",
            url: "/blog"
        },
        {
            title: "FAQs",
            url: "/faqs"
        },
    ]
    return (
        <footer id="footer" className="bg-green-800 text-white px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">

                {/* About */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Farm Sawa</h2>
                    <p className="mb-4 leading-7">Farm Sawa is an AI solution that helps farmers tackle important operational problems in their farming activities through AI-powered monitoring systems.</p>
                    <div className="flex space-x-4 mt-4">
                        <Link href="#" className="hover:text-gray-300">
                            <Facebook className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="hover:text-gray-300">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="hover:text-gray-300">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="hover:text-gray-300">
                            <Instagram className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        {
                            quickLinks.map(link =>
                            {
                                return(
                                    <li key={link.title}>
                                        <Link href={link.url} className="hover:underline hover:text-green-600">{link.title}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Resources</h3>
                    <ul className="space-y-2">
                        {
                            resources.map(link =>
                            {
                                return(
                                    <li key={link.title}>
                                        <Link href={link.url} className="hover:underline hover:text-green-600">{link.title}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
                    <p className="mb-4">Subscribe to our newsletter to get updates about our products and services.</p>
                    <form className="flex gap-2">
                        <input type="email" placeholder="Your email" className="w-full px-4 py-2 text-white"/>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Copyright section */}
            <p className="text-center text-sm text-gray-300 mt-12 border-t border-green-700 pt-6">&copy; {new Date().getFullYear()} FarmSawa. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
