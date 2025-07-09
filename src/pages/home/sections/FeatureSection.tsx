import { BarChart3, Shield, Target, Users } from "lucide-react";

const FeaturesSection = () => {
    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Sécurité Maximale",
            description: "Toutes vos transactions sont sécurisées et traçables"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Tableau de Bord",
            description: "Suivez vos performances en temps réel"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Ciblage Précis",
            description: "Trouvez exactement ce que vous cherchez"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Réseau Étendu",
            description: "Connectez-vous avec des milliers de partenaires"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Pourquoi Choisir <span className="text-green-600">Terminal d'Échanges</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-blue-600 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;