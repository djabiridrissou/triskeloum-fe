import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ icon, title, description, features }: any) => {
    const navigate = useNavigate();

    return (
        <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className={`hover:bg-green-800 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600 inline-flex bg-gray-900 items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br  bg-gray-900 text-white mb-6`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
            <ul className="space-y-3">
                {features.map((feature: any, index: any) => (
                    <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                    </li>
                ))}
            </ul>
            <button onClick={() => { navigate('/services') }} className="cursor-pointer mt-8 w-full bg-gray-900 text-white py-3 rounded-full font-semibold hover:bg-green-800 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-blue-600">
                En savoir plus
            </button>
        </div>
    );
};

export default ServiceCard;