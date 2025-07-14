import { useState } from "react";
import { FiEye, FiLock, FiUnlock, FiEdit2, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loading from "../../components/Loading";
import { useGetBuyerQuery, useGetBuyersQuery, useGetSellerQuery, useGetSellersQuery, useUpdateCanLoginMutation } from "../../services/api";
import Modal from "../../components/Modal";
import BuyerDetails from "../../sections/BuyerDetail";
import Swal from "sweetalert2";
import SellerDetail from "../../sections/SellerDetail";


const AdminSellers = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);


    const { data: response, isLoading, error } = useGetSellersQuery({
        page,
        limit,
        searchQuery,
        sortField,
        sortOrder
    });

    const { data: sellerDetails } = useGetSellerQuery(selectedSellerId || "", {
        skip: !selectedSellerId
    });

    const [updateCanLogin] = useUpdateCanLoginMutation();

    const handleViewDetails = (id: string) => {
        setSelectedSellerId(id);
    };

    const closeModal = () => {
        setSelectedSellerId(null);
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen">
            <div className="text-red-500">Erreur lors du chargement des fournisseurs</div>
        </div>;
    }

    const toggleStatus = async (representativeId: string, currentCanLogin: boolean) => {
        const action = currentCanLogin ? 'bloquer' : 'débloquer';
        const successMessage = currentCanLogin
            ? 'L\'acheteur a été bloqué avec succès'
            : 'L\'acheteur a été débloqué avec succès';
        const confirmText = currentCanLogin
            ? 'Voulez-vous vraiment bloquer cet acheteur ?'
            : 'Voulez-vous vraiment débloquer cet acheteur ?';

        const result = await Swal.fire({
            title: `Confirmer ${action}`,
            text: confirmText,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: currentCanLogin ? '#d33' : '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: `Oui, ${action}`,
            cancelButtonText: 'Annuler',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await updateCanLogin({
                    userId: representativeId,
                    canLogin: !currentCanLogin
                }).unwrap();

                Swal.fire(
                    'Succès !',
                    successMessage,
                    'success'
                );
            } catch (error) {
                Swal.fire(
                    'Erreur',
                    `Une erreur est survenue lors de ${action}`,
                    'error'
                );
            }
        }
    };

    const buyers = response?.data || [];
    const pagination = response?.pagination;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Fournisseurs</h1>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative flex-grow max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un acheteur..."
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

            {/* Tableau des acheteurs */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => handleSort("socialReason")}
                                >
                                    <div className="flex items-center">
                                        Raison Sociale
                                        {sortField === "socialReason" && (
                                            <span className="ml-1">
                                                {sortOrder === "asc" ? "↑" : "↓"}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
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
                                {/*                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th> */}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {buyers.length > 0 ? (
                                buyers.map((buyer: any) => (
                                    <tr key={buyer._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{buyer.socialReason}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{buyer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{buyer.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{buyer.country}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(buyer.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        {/*    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${buyer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {buyer.status === 'active' ? 'Actif' : 'Bloqué'}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    className="p-2 text-blue-600 hover:text-blue-900 transition rounded-lg hover:bg-blue-50"
                                                    title="Voir détails"
                                                    onClick={() => handleViewDetails(buyer._id)}
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                {/*  <button
                                                    className="p-2 text-yellow-600 hover:text-yellow-900 transition rounded-lg hover:bg-yellow-50"
                                                    title="Modifier"
                                                >
                                                    <FiEdit2 className="w-5 h-5" />
                                                </button> */}
                                                <button
                                                    className={`p-2 rounded-lg hover:bg-opacity-20 transition group relative ${buyer.representativeId.canLogin
                                                        ? 'text-red-600 hover:bg-red-100'
                                                        : 'text-green-600 hover:bg-green-100'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleStatus(buyer.representativeId._id, buyer.representativeId.canLogin);
                                                    }}
                                                    title={buyer.representativeId.canLogin ? 'Bloquer' : 'Débloquer'}
                                                >
                                                    {buyer.representativeId.canLogin ? (
                                                        <FiLock className="w-5 h-5" />
                                                    ) : (
                                                        <FiUnlock className="w-5 h-5" />
                                                    )}
                                                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {buyer.representativeId.canLogin ? 'Bloquer l\'accès' : 'Autoriser l\'accès'}
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Aucun acheteur trouvé
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
                                Affichage de <span className="font-medium">{(page - 1) * limit + 1}</span> à <span className="font-medium">{Math.min(page * limit, pagination.total)}</span> sur <span className="font-medium">{pagination.total}</span> acheteurs
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
            <Modal
                isOpen={!!selectedSellerId}
                onClose={closeModal}
                title="Détails de l'acheteur"
            >
                {sellerDetails?.data && <SellerDetail seller={sellerDetails.data} />}
            </Modal>
        </div>
    );
};

export default AdminSellers;