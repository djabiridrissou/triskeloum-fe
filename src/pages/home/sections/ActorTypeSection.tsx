// ActorTypesSection.jsx
import { Globe, MapPin, ShoppingCart } from "lucide-react";
import { useState } from "react";
import ActorCard from "../../../components/ActorCard";
import ContactModal from "../../../components/ContactModal";


const ActorTypesSection = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');

    const handleContactClick = (type: any) => {
        setModalType(type);
        setIsModalVisible(true);
    };

    const actors = [
        {
            type: "Fournisseur de marchandises",
            price: "",
            icon: <Globe className="w-12 h-12" />,
            benefits: [
                "Accès direct et sécurisé au marché régional",
                "Réseau de distribution fiable et étendu",
                "Support multilingue pour faciliter les échanges en langue locale et internationale",
                "Conformité et certifications reconnues",
                "Visibilité accrue auprès des clients"
            ],
            color: "from-orange-400 to-red-500",
            popular: false,
            isContact: true,
            contactType: 'fournisseur'
        },
        {
            type: "Représentant National ou Regional",
            price: "",
            icon: <MapPin className="w-12 h-12" />,
            benefits: [
                "Présence locale et meilleure connaissance du marché",
                "Livraison optimisée et délais réduits",
                "Assistance et accompagnement personnalisé",
                "Conditions tarifaires adaptées aux réalités régionales",
                "Facilité de communication en langue locale"
            ],
            color: "from-blue-400 to-cyan-500",
            popular: false,
            isContact: true,
            contactType: 'representant'
        },
        {
            type: "Acheteur Grossiste",
            price: "20,000 FCFA",
            icon: <ShoppingCart className="w-12 h-12" />,
            benefits: [
                "Accès au catalogue complet",
                "Commandes simplifiées",
                "Paiement flexible",
                "Suivi des commandes"
            ],
            color: "from-purple-400 to-pink-500",
            popular: true,
            isContact: false,
            url: '/register?type=revendeur&step=0'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                       Devenez <span className="text-green-600">Partenaire</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Que vous soyez fournisseur ou distributeur, nous avons la formule adaptée à vos besoins
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {actors.map((actor, index) => (
                        <ActorCard 
                            key={index} 
                            {...actor} 
                            onContact={actor.isContact ? handleContactClick : null}
                        />
                    ))}
                </div>

                <ContactModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    type={modalType}
                />
            </div>
        </section>
    );
};

export default ActorTypesSection;