import { Phone } from "lucide-react";

const PaymentPhoneInput = ({ value, onChange, error, paymentMethod }: any) => {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-gray-700" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Numéro de paiement</h2>
            <p className="text-gray-600 text-sm">
              Votre numéro {paymentMethod === 'mixx' ? 'Mixx' : 'Flooz'} pour le paiement
            </p>
          </div>
        </div>
        
        <div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ex: 90 00 00 00"
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl transition-colors ${
                error ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
              } focus:outline-none`}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
  
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            💡 Un code de validation sera envoyé à ce numéro pour confirmer le paiement
          </p>
        </div>
      </div>
    );
  };

  export default PaymentPhoneInput;