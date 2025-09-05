import { Check, Wallet } from "lucide-react";

const PaymentMethodSelector = ({ onSelect, selectedMethod, recipientNetwork }: any) => {
    const methods = [
        { id: 'mixx', name: 'Mixx', logo: '/images/mixx.png', desc: 'Paiement via Mixx Money' },
        { id: 'flooz', name: 'Flooz', logo: '/images/flooz.png', desc: 'Paiement via Flooz Money' }
    ];

    // Filtrer pour exclure le réseau destinataire si nécessaire
    const availableMethods = methods;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Wallet className="w-6 h-6 text-gray-700" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Moyen de paiement</h2>
                    <p className="text-gray-600 text-sm">Comment souhaitez-vous payer ?</p>
                </div>
            </div>

            <div className="space-y-3">
                {availableMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`w-full p-4 bg-white border-2 rounded-xl transition-all duration-300 ${selectedMethod === method.id
                                ? 'border-blue-500 shadow-lg bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={method.logo}
                                    alt={method.name}
                                    className="w-12 h-12 object-contain"
                                />
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">{method.name}</p>
                                    <p className="text-sm text-gray-600">{method.desc}</p>
                                </div>
                            </div>
                            {selectedMethod === method.id && (
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;