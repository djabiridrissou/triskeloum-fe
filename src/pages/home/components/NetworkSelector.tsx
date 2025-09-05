import { Check } from 'lucide-react';

const NetworkSelector = ({ onSelect, selectedNetwork }: any) => {
  const networks = [
    { id: 'mixx', name: 'Mixx', logo: '/images/mixx.png', color: 'from-orange-500 to-red-500' },
    { id: 'flooz', name: 'Flooz', logo: '/images/flooz.png', color: 'from-blue-500 to-indigo-500' }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Quel réseau utilisez-vous ?</h2>
      <p className="text-gray-600 mb-8">Sélectionnez votre opérateur mobile</p>
      
      <div className="grid grid-cols-2 gap-4">
        {networks.map((network) => (
          <button
            key={network.id}
            onClick={() => onSelect(network.id)}
            className={`relative p-6 bg-white border-2 rounded-2xl transition-all duration-300 hover:scale-105 ${
              selectedNetwork === network.id 
                ? 'border-green-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {selectedNetwork === network.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <img 
                src={network.logo} 
                alt={network.name} 
                className="w-20 h-20 object-contain mb-3"
              />
              <span className="font-semibold text-gray-900">{network.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;