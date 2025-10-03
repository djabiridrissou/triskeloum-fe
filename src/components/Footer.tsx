import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = () => {
        if (email.trim()) {
            console.log("Newsletter subscription:", email);
            setEmail("");
            alert("Merci pour votre inscription à notre newsletter !");
        }
    };

    return (
        <footer className="bg-white text-white">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section principale */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* À propos */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="w-[150px] h-[150px] rounded-lg flex items-center justify-center mr-3">
                                    <img src="/images/argusLogo.png" alt="" />
                                </div>
                            </div>
                            <div className="flex space-x-4">
                              
                            </div>
                        </div>

                        {/* Solutions */}
                        <div>
                            {/*   <h3 className="text-white font-semibold mb-6">Solutions</h3> */}
                            {/*  <ul className="space-y-3">
                                <li>
                                    <a href="/fournisseurs" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Espace Fournisseurs
                                    </a>
                                </li>
                                <li>
                                    <a href="/distributeurs" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Espace Distributeurs
                                    </a>
                                </li>
                                <li>
                                    <a href="/marketplace" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Marketplace
                                    </a>
                                </li>
                                <li>
                                    <a href="/gestion-stock" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Gestion de Stock
                                    </a>
                                </li>
                            </ul> */}
                        </div>

                        {/* Support */}
                        <div>
                            {/*  <h3 className="text-white font-semibold mb-6">Support</h3> */}
                            {/* <ul className="space-y-3">
                                <li>
                                    <a href="/aide" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Centre d'aide
                                    </a>
                                </li>
                                <li>
                                    <a href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Nous contacter
                                    </a>
                                </li>
                                <li>
                                    <a href="/guides" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Guides d'utilisation
                                    </a>
                                </li>
                                <li>
                                    <a href="/api" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                        Documentation API
                                    </a>
                                </li>
                            </ul> */}
                        </div>

                        {/* Newsletter */}
                        <div>
                          
                            <div className="space-y-3">
                                <div className="flex">
                                   
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="mt-6 space-y-2">
                               
                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section bas */}
                <div className="border-t border-gray-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Powered by Revgen Technologies All rights reserved.
                        </div>
                        <div className="flex space-x-6">
                            <a href="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                               Legal mentions
                            </a>
                            <a href="/confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Privacy
                            </a>
                            <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Cookies
                            </a>
                            <a href="/cgu" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                CGU
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;