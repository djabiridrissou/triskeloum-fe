import { Eye, Star, Package, ShoppingCart } from "lucide-react";

const ProductCardPremium = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
                src={product.images[0] || '/api/placeholder/300/200'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
                <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                </span>
            </div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Eye className="w-5 h-5 text-gray-700" />
                </button>
            </div>
        </div>

        <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-600">{product.brand}</span>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">4.8</span>
                </div>
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <span className="text-2xl font-bold text-gray-900">
                        {product.batchStats.avgUnitPrice.toLocaleString()} XOF
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/{product.unitOfMeasure}</span>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500">En Stock</div>
                    <div className="font-semibold text-green-600 text-xs">{product.batchStats.totalActualQty}</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {product.supplierId.name}
                </span>
                <button className="bg-gray-900 cursor-pointer transition-colors duration-300 hover:bg-gradient-to-br hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter
                </button>
            </div>
        </div>
    </div>
);


export default ProductCardPremium;