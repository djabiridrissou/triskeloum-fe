
const PhoneNumberInput = ({ value, onChange, error, paymentMethod }: any) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Numéro de paiement</h2>
            <p className="text-gray-600 mb-8">
                Entrez votre numéro {paymentMethod === 'mixx' ? 'Mixx' : 'Flooz'} pour effectuer le paiement
            </p>

            <div className="relative">
                <input
                    type="tel"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Ex: 90 00 00 00"
                    className={`w-full px-4 py-4 text-lg border-2 rounded-xl transition-colors ${error ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none`}
                />
                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    ℹ️ Un code de confirmation sera envoyé à ce numéro
                </p>
            </div>
        </div>
    );
};

export default PhoneNumberInput;