import { Eye, Star, Package, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FiImage } from "react-icons/fi";
import { useCartContext } from "../contexts/CartContext";


const ProductCardPremium = ({ product }: { product: any }) => {
    const { addToCart } = useCartContext();
    const navigate = useNavigate();
    let imgBaseUrl = import.meta.env.VITE_BASE_WITHOUT_ORIGIN;

    const handleAddToCart = () => {
        console.log("Adding product to cart:", product);
        addToCart({
            id: product._id,
            name: product.name,
            price: product.batchStats.avgUnitPrice,
            image: product.images?.[0],
            supplierId: product.supplierId._id,
            supplierName: product.supplierId.name,
            unit: product.unitOfMeasure,
            maxQuantity: product.batchStats.totalActualQty
        });
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {product.images?.[0] ? (
                    <img
                        src={`${imgBaseUrl}/${product.images[0]}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="text-gray-400 text-4xl" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {product.category}
                    </span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        onClick={() => navigate(`/product/${product._id}`)}
                    >
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
                        <div className="font-semibold text-green-600 text-xs">
                            {product.batchStats.totalActualQty} {product.unitOfMeasure}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {product.supplierId.name}
                    </span>
                    <button 
                        className="bg-gray-900 cursor-pointer transition-colors duration-300 hover:bg-gradient-to-br hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCardPremium;