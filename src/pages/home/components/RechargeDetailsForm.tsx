import { Check, Phone } from "lucide-react";

const RechargeDetailsForm = ({
    network,
    setNetwork,
    recipientNumber,
    setRecipientNumber,
    amount,
    setAmount,
    errors
}: any) => {
    const networks = [
        { id: 'yas', name: 'Yas', logo: '/images/yas.jpeg', color: 'from-orange-500 to-red-500' },
        { id: 'moov', name: 'Moov Africa', logo: '/images/moov.jpeg', color: 'from-blue-500 to-indigo-500' }
    ];

    const quickAmounts = [500, 1000, 2000, 5000, 10000];

    return (
        <div className="w-full max-w-lg mx-auto space-y-8">
            {/* Sélection du réseau */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    1. Réseau du bénéficiaire
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {networks.map((net) => (
                        <button
                            key={net.id}
                            onClick={() => setNetwork(net.id)}
                            className={`relative p-4 bg-white border-2 rounded-xl transition-all duration-300 hover:scale-105 ${network === net.id
                                    ? 'border-blue-500 shadow-lg bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {network === net.id && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                            <div className="flex flex-col items-center">
                                <img
                                    src={net.logo}
                                    alt={net.name}
                                    className="w-16 h-16 object-contain mb-2"
                                />
                                <span className="font-medium text-gray-900">{net.name}</span>
                            </div>
                        </button>
                    ))}
                </div>
                {errors.network && (
                    <p className="mt-2 text-sm text-red-600">{errors.network}</p>
                )}
            </div>

            {/* Numéro du bénéficiaire */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    2. Numéro du bénéficiaire
                </h3>
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="tel"
                        value={recipientNumber}
                        onChange={(e) => setRecipientNumber(e.target.value)}
                        placeholder="Ex: 90 00 00 00"
                        className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl transition-colors ${errors.recipientNumber ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                            } focus:outline-none`}
                    />
                </div>
                {errors.recipientNumber && (
                    <p className="mt-2 text-sm text-red-600">{errors.recipientNumber}</p>
                )}
                {network && (
                    <p className="mt-2 text-sm text-gray-600">
                        Numéro {network === 'yas' ? 'Yas' : 'Moov'} qui recevra le crédit
                    </p>
                )}
            </div>

            {/* Montant */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    3. Montant de la recharge
                </h3>
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Entrez le montant"
                            className={`w-full px-4 py-4 pr-16 text-lg border-2 rounded-xl transition-colors ${errors.amount ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                                } focus:outline-none`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            FCFA
                        </span>
                    </div>
                    {errors.amount && (
                        <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Montants suggérés</p>
                    <div className="flex flex-wrap gap-2">
                        {quickAmounts.map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setAmount(amt.toString())}
                                className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${amount === amt.toString()
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                {amt.toLocaleString()} F
                            </button>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                    Min: 100 FCFA • Max: 500,000 FCFA
                </p>
            </div>
        </div>
    );
};

export default RechargeDetailsForm;