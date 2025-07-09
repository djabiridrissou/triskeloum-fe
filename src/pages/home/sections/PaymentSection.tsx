import { CreditCard } from "lucide-react";

const PaymentMethodsSection = () => {
    const paymentMethods = [
        { name: "Mixx by Yas", number: "90291421", icon: <CreditCard className="w-6 h-6" /> },
        { name: "Flooz", number: "98042314", icon: <CreditCard className="w-6 h-6" /> },
        { name: "NSIA Banque", number: "260081527014", icon: <CreditCard className="w-6 h-6" /> },
        { name: "Banque Atlantique", number: "À venir", icon: <CreditCard className="w-6 h-6" /> }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Moyens de <span className="text-yellow-300">Paiement</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Payez en toute sécurité avec nos partenaires financiers de confiance
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paymentMethods.map((method, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                            <div className="text-yellow-300 mb-4">{method.icon}</div>
                            <h3 className="text-xl font-bold text-white mb-2">{method.name}</h3>
                            <p className="text-gray-300 font-mono">{method.number}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PaymentMethodsSection;