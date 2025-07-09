import { Globe, MapPin, ShoppingCart } from "lucide-react";
import ActorCard from "../../../components/ActorCard";

const ActorTypesSection = () => {
    const actors = [
        {
            type: "Fournisseurs Internationaux",
            price: "100,000 FCFA",
            icon: <Globe className="w-12 h-12" />,
            benefits: [
                "Accès au marché local",
                "Réseau de distribution",
                "Support multilingue",
                "Certification internationale"
            ],
            color: "from-orange-400 to-red-500",
            popular: true
        },
        {
            type: "Fournisseurs Nationaux",
            price: "50,000 FCFA",
            icon: <MapPin className="w-12 h-12" />,
            benefits: [
                "Proximité géographique",
                "Livraison rapide",
                "Support local",
                "Tarifs préférentiels"
            ],
            color: "from-blue-400 to-cyan-500",
            popular: false
        },
        {
            type: "Revendeurs",
            price: "20,000 FCFA",
            icon: <ShoppingCart className="w-12 h-12" />,
            benefits: [
                "Accès au catalogue complet",
                "Commandes simplifiées",
                "Paiement flexible",
                "Suivi des commandes"
            ],
            color: "from-purple-400 to-pink-500",
            popular: false
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Choisissez Votre <span className="text-green-600">Profil</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Que vous soyez fournisseur ou revendeur, nous avons la solution adaptée à vos besoins
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {actors.map((actor, index) => (
                        <ActorCard key={index} {...actor} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ActorTypesSection;