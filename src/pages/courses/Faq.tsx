// src/pages/courses/Faq.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import Modal2 from '../../components/Modal2';
import { faqService, FaqData } from '../../services/faqs';

interface FaqFormData extends FaqData {
    category: 'account' | 'courses' | 'payment' | 'settings';
}

const FAQ_CATEGORIES = [
    { value: 'account', label: 'Compte' },
    { value: 'courses', label: 'Cours' },
    { value: 'payment', label: 'Paiement' },
    { value: 'settings', label: 'Paramètres' },
];

const Faq: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<any | null>(null);
    const [formData, setFormData] = useState<FaqFormData>({
        question: '',
        answer: '',
        category: 'courses',
        order: 0,
        is_published: true,
        tags: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch FAQs
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                setIsLoading(true);
                const response = await faqService.getFaqs(page, 10, debouncedSearch);
                setFaqs(response?.payload || []);
                setTotalPages(response?.payload?.pagination?.totalPages || 1);
            } catch (error: any) {
                toast.error(error?.message || 'Erreur lors du chargement');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, [page, debouncedSearch]);

    const stats = {
        total: faqs.length,
        published: faqs.filter(f => f.is_published).length,
        views: faqs.reduce((sum, f) => sum + (f.views || 0), 0),
    };

    const handleCreate = () => {
        setSelectedFaq(null);
        setFormData({
            question: '',
            answer: '',
            category: 'courses',
            order: 0,
            is_published: true,
            tags: [],
        });
        setIsFormModalOpen(true);
    };

    const handleEdit = (faq: any) => {
        setSelectedFaq(faq);
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order,
            is_published: faq.is_published,
            tags: faq.tags || [],
        });
        setIsFormModalOpen(true);
    };

    const handleDelete = async (faqId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) {
            return;
        }
        try {
            await faqService.deleteFaq(faqId);
            toast.success('FAQ supprimée');
            setPage(1);
        } catch (error: any) {
            toast.error(error?.message || 'Erreur lors de la suppression');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.question || !formData.answer) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
        }

        try {
            setIsSubmitting(true);

            if (selectedFaq) {
                await faqService.updateFaq(selectedFaq.id, formData);
                toast.success('FAQ modifiée');
            } else {
                await faqService.createFaq(formData);
                toast.success('FAQ créée');
            }

            setIsFormModalOpen(false);
            setPage(1);
            setDebouncedSearch('');
            setSearch('');
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error?.message || 'Erreur lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="max-w-8xl mx-2 w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">FAQs</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez les questions fréquemment posées</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Nouvelle FAQ
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">❓</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Publiées</p>
                                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{stats.published}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total des vues</p>
                                <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">👁️ {stats.views}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📊</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Rechercher une FAQ..."
                    />
                </div>

                {/* Content */}
                {isLoading ? (
                    <LoadingSkeleton />
                ) : faqs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">❓</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune FAQ</h3>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">Commencez par créer votre première FAQ</p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Créer une FAQ
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Question</th>
                                        <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Catégorie</th>
                                        <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vues</th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Statut</th>
                                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqs.map((faq: any) => (
                                        <tr key={faq.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 font-medium truncate">
                                                <div className="line-clamp-1">{faq.question}</div>
                                            </td>
                                            <td className="hidden sm:table-cell px-6 py-4 text-xs text-gray-600">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                    {FAQ_CATEGORIES.find(c => c.value === faq.category)?.label || faq.category}
                                                </span>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-xs text-gray-600">👁️ {faq.views || 0}</td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <span
                                                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                                                        faq.is_published
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {faq.is_published ? 'Publiée' : 'Brouillon'}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(faq)}
                                                        title="Modifier"
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(faq.id)}
                                                        title="Supprimer"
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    </>
                )}

                {/* Form Modal */}
                <Modal2
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    title={selectedFaq ? 'Modifier la FAQ' : 'Créer une nouvelle FAQ'}
                    size="lg"
                >
                    <div className="p-4 sm:p-6">
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {/* Question */}
                            <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Question *
                        </label>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Entrez la question"
                        />
                    </div>

                    {/* Answer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Réponse *
                        </label>
                        <textarea
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Entrez la réponse détaillée"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Catégorie *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {FAQ_CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Order */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Ordre d'affichage
                        </label>
                        <input
                            type="number"
                            value={formData.order || 0}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Les FAQs sont triées par ordre croissant</p>
                    </div>

                    {/* Published */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={formData.is_published}
                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="is_published" className="ml-2 text-sm text-gray-900">
                            Publier cette FAQ
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsFormModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Traitement...' : selectedFaq ? 'Modifier' : 'Créer'}
                        </button>
                            </div>
                        </form>
                    </div>
                </Modal2>
            </div>
        </div>
    );
};

export default Faq;