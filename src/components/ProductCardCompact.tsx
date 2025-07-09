const ProductCardCompact = ({ product }: { product: any }) => (
    <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
        <div className="flex gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={product.images[0] || '/api/placeholder/80/80'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {product.brand}
                    </span>
                    <span className="text-xs text-gray-500">{product.category}</span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.description}</p>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-bold text-gray-900">
                            {product.batchStats.avgUnitPrice.toLocaleString()} XOF
                        </span>
                        <span className="text-xs text-gray-500 ml-1">Stock: {product.batchStats.totalActualQty}</span>
                    </div>
                    <button className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors">
                        Voir
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ProductCardCompact;