import { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiX } from "react-icons/fi";
import { useGetProductsQuery } from "../../services/api";
import ProductCardPremium from "../../components/ProductCardPremium";
import Loading from "../../components/Loading";


const BuyerHome = () => {
    // State pour la pagination et la recherche
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    
    // State pour les filtres
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        brand: "",
    });

    // Récupération des produits
    const { data: response, isLoading, error, refetch } = useGetProductsQuery({
        page,
        limit,
        searchQuery,
        sortField,
        sortOrder,
        ...filters
    });

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setFilters({
            category: "",
            minPrice: "",
            maxPrice: "",
            brand: "",
        });
    };

    // Effet pour réinitialiser la page quand les filtres changent
    useEffect(() => {
        setPage(1);
    }, [searchQuery, sortField, sortOrder, filters]);

    // Gestion du tri
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    // Données des produits et pagination
    const products = response?.data || [];
    const pagination = response?.pagination;

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">Erreur lors du chargement des produits</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* En-tête avec titre et statistiques */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Catalogue des Produits</h1>
                <p className="text-gray-600">
                    Découvrez notre sélection de produits de qualité
                </p>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                            <FiFilter />
                            <span>Filtres</span>
                        </button>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value="12">12 par page</option>
                            <option value="24">24 par page</option>
                            <option value="48">48 par page</option>
                            <option value="-1">Tous</option>
                        </select>
                    </div>
                </div>

                {/* Panneau des filtres */}
                {showFilters && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium">Filtrer les produits</h3>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Réinitialiser
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Catégorie
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    value={filters.category}
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                >
                                    <option value="">Toutes catégories</option>
                                    <option value="electronics">Électronique</option>
                                    <option value="clothing">Vêtements</option>
                                    <option value="food">Alimentation</option>
                                    <option value="furniture">Meubles</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Marque
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="Filtrer par marque"
                                    value={filters.brand}
                                    onChange={(e) => setFilters({...filters, brand: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix min (XOF)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="0"
                                    min="0"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Prix max (XOF)
                                </label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    placeholder="100000"
                                    min="0"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Options de tri */}
            <div className="mb-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Trier par:</span>
                <button
                    onClick={() => handleSort("createdAt")}
                    className={`px-3 py-1 text-sm rounded-full ${sortField === "createdAt" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                    Date {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                    onClick={() => handleSort("batchStats.avgUnitPrice")}
                    className={`px-3 py-1 text-sm rounded-full ${sortField === "batchStats.avgUnitPrice" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                    Prix {sortField === "batchStats.avgUnitPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                    onClick={() => handleSort("batchStats.totalActualQty")}
                    className={`px-3 py-1 text-sm rounded-full ${sortField === "batchStats.totalActualQty" ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                    Stock {sortField === "batchStats.totalActualQty" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
            </div>

            {/* Liste des produits */}
            {products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">Aucun produit trouvé avec ces critères</p>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            resetFilters();
                        }}
                        className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product: any) => (
                            <ProductCardPremium key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Affichage de <span className="font-medium">{(page - 1) * limit + 1}</span> à{" "}
                                    <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> sur{" "}
                                    <span className="font-medium">{pagination.total}</span> produits
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className={`px-3 py-1 rounded-md border ${
                                        page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <FiChevronLeft />
                                </button>

                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= pagination.pages - 2) {
                                        pageNum = pagination.pages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-3 py-1 rounded-md border ${
                                                page === pageNum ? "bg-blue-500 text-white" : "bg-white hover:bg-gray-50"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {pagination.pages > 5 && page < pagination.pages - 2 && (
                                    <span className="px-3 py-1">...</span>
                                )}

                                {pagination.pages > 5 && page < pagination.pages - 2 && (
                                    <button
                                        onClick={() => setPage(pagination.pages)}
                                        className="px-3 py-1 rounded-md border bg-white hover:bg-gray-50"
                                    >
                                        {pagination.pages}
                                    </button>
                                )}

                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                                    disabled={page === pagination.pages}
                                    className={`px-3 py-1 rounded-md border ${
                                        page === pagination.pages
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BuyerHome;