

const OrderSummary = ({ network, recipientNumber, amount, paymentMethod, phoneNumber }: any) => {
    return (
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation</h2>
        <p className="text-gray-600 mb-6">Vérifiez les détails avant de confirmer</p>
        
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="pb-4 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">DÉTAILS DE LA RECHARGE</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Réseau</span>
                <span className="font-semibold capitalize">{network}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bénéficiaire</span>
                <span className="font-semibold">{recipientNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Montant</span>
                <span className="font-bold text-lg text-blue-600">
                  {parseInt(amount).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-3">PAIEMENT</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Via</span>
                <span className="font-semibold capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Numéro débiteur</span>
                <span className="font-semibold">{phoneNumber}</span>
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 text-center">
            ✅ Transaction sécurisée et instantanée
          </p>
        </div>
      </div>
    );
  };
  

export default OrderSummary;