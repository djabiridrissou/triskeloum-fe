import { FileText, Handshake, Package } from "lucide-react";
import ServiceCard from "../../../components/ServiceCard";

const ServicesSection = () => {
    const services = [
        {
            icon: <FileText className="w-8 h-8" />,
            title: "FICHE D'ÉCHANGES",
            description: "Système de gestion transparent pour tous vos échanges commerciaux",
            features: ["Traçabilité complète", "Validation automatique", "Historique détaillé"],
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Package className="w-8 h-8" />,
            title: "Gestion de Stock",
            description: "Catalogue centralisé de toutes les marchandises disponibles",
            features: ["Mise à jour temps réel", "Recherche avancée", "Alertes stock"],
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <Handshake className="w-8 h-8" />,
            title: "Commandes Sécurisées",
            description: "Processus de commande simplifié avec paiement sécurisé",
            features: ["Paiement flexible", "Suivi en temps réel", "Support 24/7"],
            color: "from-emerald-500 to-teal-500"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Nos Services <span className="text-green-600">Innovants</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez comment Terminal d'Échanges révolutionne la façon dont vous gérez vos relations commerciales
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;