import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const Footer = () => {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = () => {
        if (email.trim()) {
            // Simulation d'inscription newsletter
            console.log("Newsletter subscription:", email);
            setEmail("");
            alert("Merci pour votre inscription à notre newsletter !");
        }
    };

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section principale */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* À propos */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                                    <img src="/images/logob.png" alt="" />
                                </div>
                                <span className="text-xl font-semibold">Terminal d'Échanges</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                La plateforme de référence pour les échanges commerciaux B2B.
                                Connectez-vous avec des partenaires de confiance et développez votre activité.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <Linkedin className="h-5 w-5" />
                                </a>
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
                            <h3 className="text-white font-semibold mb-6">Restez informé</h3>
                            <p className="text-gray-300 text-sm mb-4">
                                Recevez nos dernières actualités et mises à jour.
                            </p>
                            <div className="space-y-3">
                                <div className="flex">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Votre adresse email"
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleNewsletterSubmit}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-r-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        S'abonner
                                    </button>
                                </div>
                            </div>

                            {/* Contact info */}
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center text-gray-300 text-sm">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span>terminalechangetg@gmail.com</span>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm">
                                    <Phone className="h-4 w-4 mr-2" />
                                    <span>+228 22 26 60 93 </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section bas */}
                <div className="border-t border-gray-800 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Terminal d'Échanges. Tous droits réservés.
                        </div>
                        <div className="flex space-x-6">
                            <a href="/mentions-legales" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Mentions légales
                            </a>
                            <a href="/confidentialite" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                                Confidentialité
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