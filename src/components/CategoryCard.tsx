import { Package } from "lucide-react";

const CategoryCard = ({ category, isActive, onClick }: {
    category: any;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`group p-4 rounded-2xl border-2 transition-all duration-300 text-left w-full ${isActive
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
    >
        <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                {category.name}
            </h3>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                <Package className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
            </div>
        </div>
        <p className={`text-sm ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
            {category.totalProducts} produits
        </p>
    </button>
);

export default CategoryCard;