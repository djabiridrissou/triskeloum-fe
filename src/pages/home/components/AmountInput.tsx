
const AmountInput = ({ value, onChange, error }: any) => {
    const quickAmounts = [500, 1000, 2000, 5000, 10000];

    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Montant de la recharge</h2>
            <p className="text-gray-600 mb-8">Entre 100 et 500 000 FCFA</p>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Entrez le montant"
                        className={`w-full px-4 py-4 pr-16 text-lg border-2 rounded-xl transition-colors ${error ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                            } focus:outline-none`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        FCFA
                    </span>
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </div>

            <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">Montants suggérés</p>
                <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => onChange(amount.toString())}
                            className={`px-4 py-2 rounded-lg border-2 transition-all ${value === amount.toString()
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            {amount.toLocaleString()} F
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AmountInput;