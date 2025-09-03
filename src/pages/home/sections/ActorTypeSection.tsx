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
            type: "Fournisseur de marchandises national ou international",
            price: "",
            icon: <Globe className="w-8 h-8" />,
            color: "from-orange-400 to-red-500",
            popular: false,
            isContact: true,
            contactType: 'fournisseur'
        },
        {
            type: "Représentant National ou Regional",
            price: "",
            icon: <MapPin className="w-8 h-8" />,
            color: "from-blue-400 to-cyan-500",
            popular: false,
            isContact: true,
            contactType: 'representant'
        },
        {
            type: "Acheteur Grossiste",
            price: "20,000 FCFA",
            icon: <ShoppingCart className="w-8 h-8" />,
            color: "from-purple-400 to-pink-500",
            popular: true,
            isContact: false,
            url: '/register?type=revendeur&step=0'
        }
    ];

    return (
        <section className=" bg-gradient-to-b from-gray-50/50 to-white">
            <div className="container mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                       Devenez <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Partenaire</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Que vous soyez fournisseur ou distributeur, nous avons la formule adaptée à vos besoins
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {actors.map((actor, index) => (
                        <ActorCard 
                            key={index}
                            {...actor}
                            onContact={actor.isContact ? handleContactClick : null}
                        />
                    ))}
                </div>

                {/* Modal */}
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