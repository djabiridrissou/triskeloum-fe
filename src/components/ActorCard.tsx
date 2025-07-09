import { CheckCircle } from "lucide-react";

const ActorCard = ({ type, price, icon, benefits, color, popular }: any) => (
    <div className={`relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${popular ? 'ring-2 ring-green-600' : ''}`}>
        {popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Populaire
                </div>
            </div>
        )}

        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${color} text-white mb-6`}>
            {icon}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{type}</h3>
        <div className="text-3xl font-bold text-blue-600 mb-6">{price}</div>

        <ul className="space-y-4 mb-8">
            {benefits.map((benefit: any, index: any) => (
                <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                </li>
            ))}
        </ul>

        <button className={`cursor-pointer text-white w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${popular
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white '
                : 'bg-gray-900 text-gray-900 hover:from-green-600 hover:to-blue-600 transition-all duration-300'
            }`}>
            S'inscrire
        </button>
    </div>
);


export default ActorCard;