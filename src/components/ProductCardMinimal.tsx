import { ChevronRight, Package } from "lucide-react";

const ProductCardMinimal = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Package className="w-8 h-8 text-blue-600" />
        </div>

        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-purple-600">{product.brand}</span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="text-sm text-gray-500">{product.category}</span>
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
                <span className="text-xl font-bold text-gray-900">
                    {product.batchStats.avgUnitPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1">XOF</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Détails
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default ProductCardMinimal;