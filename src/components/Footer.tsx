import { Button, Input } from "antd";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
    const [email, setEmail] = useState("")
    const newsletter = () => {
        if (email === "") {
            toast.error("Veuillez saisir votre email");
        } else {
            toast.success("Vous êtes maintenant abonné à notre newsletter !");
            setEmail("");
        }
    }

    return (
        <footer className="bg-gray-900 text-white mt-10">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Section À propos */}
                    <div>
                        <div className="flex items-center mb-4">
                           <img src="/images/logob.png" alt="Logo" className="h-10" />
                        </div>
                        <p className="text-gray-300 text-sm text-justify mb-4">
                            Plateforme de confiance connectant fournisseurs et revendeurs pour faciliter les échanges commerciaux en toute sécurité.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span className="bg-green-600 w-2 h-2 rounded-full"></span>
                            <span></span>
                        </div>
                    </div>

                    {/* Section Services */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Nos Services</h3>
                        <ul className="space-y-3">
                            <li><a href="/fournisseurs" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">Espace Fournisseurs</a></li>
                            <li><a href="/revendeurs" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">Espace Revendeurs</a></li>
                            <li><a href="/stock" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">Consulter le Stock</a></li>
                            <li><a href="/commandes" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">Passer Commande</a></li>
                            <li><a href="/fiche-echanges" className="text-gray-300 hover:text-blue-400 text-sm transition-colors">Fiche d'Échanges</a></li>
                        </ul>
                    </div>

                    {/* Section Tarifs & Informations */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Tarifs d'Inscription</h3>
                        <div className="space-y-3 text-sm">
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-blue-400 font-semibold">Fournisseurs Internationaux</div>
                                <div className="text-white text-lg">100.000 FCFA</div>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-green-400 font-semibold">Fournisseurs Nationaux</div>
                                <div className="text-white text-lg">50.000 FCFA</div>
                            </div>
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <div className="text-yellow-400 font-semibold">Distributeurs</div>
                                <div className="text-white text-lg">20.000 FCFA</div>
                            </div>
                        </div>
                    </div>

                    {/* Section Contact & Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Newsletter</h3>
                        
                        {/* Moyens de paiement */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-white mb-2">Moyens de Paiement</h4>
                            <div className="text-xs text-gray-300 space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="bg-blue-600 px-2 py-1 rounded">Mixx</span>
                                    <span>90291421</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-orange-600 px-2 py-1 rounded">Flooz</span>
                                    <span>98042314</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-red-600 px-2 py-1 rounded">NSIA</span>
                                    <span>260081527014</span>
                                </div>
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-sm font-medium text-white mb-2">Newsletter</h4>
                            <div className="flex">
                                <Input
                                    type="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-r-none"
                                    placeholder="Votre email"
                                    style={{ marginRight: 8 }}
                                    value={email}
                                />
                                <Button
                                    onClick={newsletter}
                                    className="rounded-l-none bg-blue-600 border-blue-600 hover:bg-blue-700"
                                    type="primary"
                                >
                                    S'abonner
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section copyright */}
                <div className="border-t border-gray-700 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Terminal d'Échanges (TE). Tous droits réservés.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="/confidentialite" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Confidentialité</a>
                        <a href="/conditions" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Conditions</a>
                        <a href="/fiche-echanges" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Fiche d'Échanges</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;