import { useState } from "react";
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight, FiEdit2, FiTrash2, FiImage } from "react-icons/fi";
import { useGetProductsQuery, useCreateProductMutation } from "../../services/api";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Swal from "sweetalert2";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import FileUpload from "../../components/FileUpload";
import { yupResolver } from "@hookform/resolvers/yup";
import axiosInstance from "../../services/axios";

interface Product {
    _id: string;
    name: string;
    brand: string;
    description: string;
    unitOfMeasure: string;
    images: string[];
    category: string;
    supplierId: any;
    createdAt: string;
    batchStats: {
        totalBatches: number;
        totalInitQty: number;
        totalActualQty: number;
        totalValue: number;
        avgUnitPrice: number;
        lossQty: number;
        lossPercentage: number;
    };
}

const productSchema = yup.object().shape({
    name: yup.string().required("Le nom du produit est requis"),
    brand: yup.string().required("La marque est requise"),
    description: yup.string().required("La description est requise"),
    unitOfMeasure: yup.string().required("L'unité de mesure est requise"),
    unitPrice: yup.number().positive("Le prix doit être positif").required("Le prix unitaire est requis"),
    stockQty: yup.number().integer("La quantité doit être un entier").positive("La quantité doit être positive").required("La quantité est requise"),
    category: yup.string().required("La catégorie est requise"),
    images: yup.array().min(1, "Au moins une image est requise"),
});

const SupplierCatalogue = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: response, isLoading, error, refetch } = useGetProductsQuery({
        page,
        limit,
        searchQuery,
        sortField,
        sortOrder
    });

    const { control, handleSubmit, reset, formState: { errors }, setValue }: any = useForm<any>({
        resolver: yupResolver(productSchema),
        defaultValues: {
            name: "",
            brand: "",
            description: "",
            unitOfMeasure: "piece",
            unitPrice: 0,
            stockQty: 0,
            category: "electronics",
            images: []
        }
    });

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const createProductWithAxios = async (formData: FormData) => {
        try {
            const response = await axiosInstance.post('/product/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            // Append all fields except images
            Object.keys(data).forEach(key => {
                if (key !== 'images') {
                    formData.append(key, data[key]);
                }
            });

            // Append each image file
            data.images.forEach((file: File) => {
                formData.append('files', file);
            });

            await createProductWithAxios(formData);

            Swal.fire({
                title: 'Succès!',
                text: 'Produit ajouté avec succès',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setIsModalOpen(false);
            reset();
            refetch();
        } catch (error: any) {
            console.error("Error adding product:", error);
            Swal.fire({
                title: 'Erreur',
                text: error.response?.data?.message || "Une erreur est survenue lors de l'ajout du produit",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-red-500">Erreur lors du chargement des produits</div>
        </div>;
    }

    const products = response?.data || [];
    const pagination = response?.pagination;
    let imgBaseUrl = import.meta.env.VITE_BASE_WITHOUT_ORIGIN;
    console.log("Image URL:", `${imgBaseUrl}${products[0].images[0]}`);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Mon Catalogue Produits</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FiPlus className="mr-2" />
                    Ajouter un produit
                </button>
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
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                        >
                            <option value="5">5 par page</option>
                            <option value="10">10 par page</option>
                            <option value="20">20 par page</option>
                            <option value="50">50 par page</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tableau des produits */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center">
                                        Produit
                                        {sortField === "name" && (
                                            <span className="ml-1">
                                                {sortOrder === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("brand")}
                                >
                                    <div className="flex items-center">
                                        Marque
                                        {sortField === "brand" && (
                                            <span className="ml-1">
                                                {sortOrder === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix moyen</th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("createdAt")}
                                >
                                    <div className="flex items-center">
                                        Date création
                                        {sortField === "createdAt" && (
                                            <span className="ml-1">
                                                {sortOrder === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.length > 0 ? (
                                products.map((product: Product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {product.images?.length > 0 ? (
                                                    <img
                                                        src={`${imgBaseUrl}/${product.images[0]}`}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <FiImage className="text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.category}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{product.brand}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {product.batchStats?.totalActualQty} {product.unitOfMeasure}
                                            </div>
                                            {product.batchStats?.lossQty > 0 && (
                                                <div className="text-xs text-red-500">
                                                    Perte: {product.batchStats?.lossQty} ({product.batchStats.lossPercentage}%)
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.batchStats?.avgUnitPrice.toFixed(2)} XOF
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Total: {product.batchStats?.totalValue.toFixed(2)} XOF
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(product.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:text-blue-900 transition rounded-lg hover:bg-blue-50"
                                                    title="Modifier"
                                                >
                                                    <FiEdit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:text-red-900 transition rounded-lg hover:bg-red-50"
                                                    title="Supprimer"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Aucun produit trouvé
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && (
                    <div className="bg-gray-50 px-6 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-200">
                        <div className="mb-2 md:mb-0">
                            <p className="text-sm text-gray-700">
                                Affichage de <span className="font-medium">{(page - 1) * limit + 1}</span> à <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> sur <span className="font-medium">{pagination.total}</span> produits
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded-md border ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FiChevronLeft className="inline" />
                            </button>

                            {Array.from({ length: Math.min(5, Math.ceil(pagination.total / limit)) }, (_, i) => {
                                const pageNum = page <= 3 ? i + 1 :
                                    page >= Math.ceil(pagination.total / limit) - 2 ? Math.ceil(pagination.total / limit) - 4 + i :
                                        page - 2 + i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-3 py-1 rounded-md border ${page === pageNum ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => setPage(p => Math.min(p + 1, Math.ceil(pagination.total / limit)))}
                                disabled={page === Math.ceil(pagination.total / limit)}
                                className={`px-3 py-1 rounded-md border ${page === Math.ceil(pagination.total / limit) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                <FiChevronRight className="inline" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal d'ajout de produit */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                title="Ajouter un nouveau produit"
            //size="lg"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit*</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Nom du produit"
                                    />
                                )}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marque*</label>
                            <Controller
                                name="brand"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className={`w-full px-3 py-2 border rounded-md ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Marque du produit"
                                    />
                                )}
                            />
                            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie*</label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="electronics">Électronique</option>
                                        <option value="clothing">Vêtements</option>
                                        <option value="food">Alimentation</option>
                                        <option value="furniture">Meubles</option>
                                        <option value="other">Autre</option>
                                    </select>
                                )}
                            />
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unité de mesure*</label>
                            <Controller
                                name="unitOfMeasure"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.unitOfMeasure ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="piece">Pièce</option>
                                        <option value="kg">Kilogramme</option>
                                        <option value="liter">Litre</option>
                                        <option value="meter">Mètre</option>
                                        <option value="box">Carton</option>
                                    </select>
                                )}
                            />
                            {errors.unitOfMeasure && <p className="mt-1 text-sm text-red-600">{errors.unitOfMeasure.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (XOF)*</label>
                            <Controller
                                name="unitPrice"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        className={`w-full px-3 py-2 border rounded-md ${errors.unitPrice ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                )}
                            />
                            {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantité en stock*</label>
                            <Controller
                                name="stockQty"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="number"
                                        className={`w-full px-3 py-2 border rounded-md ${errors.stockQty ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="0"
                                        min="0"
                                    />
                                )}
                            />
                            {errors.stockQty && <p className="mt-1 text-sm text-red-600">{errors.stockQty.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Description détaillée du produit"
                                />
                            )}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Images du produit*</label>
                        <Controller
                            name="images"
                            control={control}
                            render={({ field }) => (
                                <FileUpload
                                    acceptedFiles="image/*"
                                    multiple={true}
                                    maxFiles={5}
                                    onChange={(files: any[]) => setValue("images", files)}
                                    error={!!errors.images}
                                />
                            )}
                        />
                        {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>}
                        <p className="mt-1 text-xs text-gray-500">Formats acceptés: JPG, PNG, JPEG. Max 5 images.</p>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Enregistrer le produit
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SupplierCatalogue;