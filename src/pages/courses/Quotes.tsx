// src/pages/courses/Quotes.tsx
import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import SearchBar from '../../components/SearchBar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import Modal2 from '../../components/Modal2';
import { quoteService } from '../../services/quotes';

interface QuoteFormData {
    content: string;
    author: string;
    coverFile?: File | null;
}

const Quotes: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
    const [formData, setFormData] = useState<QuoteFormData>({
        content: '',
        author: '',
        coverFile: null
    });
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch quotes
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                setIsLoading(true);
                const response = await quoteService.getQuotes(page, 9, debouncedSearch);
                setQuotes(response?.payload?.data || []);
                setTotalPages(response?.payload?.pagination?.totalPages || 1);
            } catch (error: any) {
                toast.error(error?.message || 'Erreur lors du chargement');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuotes();
    }, [page, debouncedSearch]);

    const stats = {
        total: quotes.length,
    };

    const handleCreate = () => {
        setSelectedQuote(null);
        setFormData({
            content: '',
            author: '',
            coverFile: null
        });
        setCoverPreview(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (quote: any) => {
        setSelectedQuote(quote);
        setFormData({
            content: quote.content,
            author: quote.author,
            coverFile: null
        });
        // Afficher la couverture existante en preview
        setCoverPreview(quote.cover || null);
        setIsFormModalOpen(true);
    };

    const handleDelete = async (quoteId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette citation ?')) {
            return;
        }
        try {
            await quoteService.deleteQuote(quoteId);
            toast.success('Citation supprimée');
            setPage(1);
        } catch (error: any) {
            toast.error(error?.message || 'Erreur lors de la suppression');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.content || !formData.author) {
            toast.error('Veuillez remplir tous les champs requis');
            return;
        }

        try {
            setIsSubmitting(true);

            // Créer FormData
            const submitData = new FormData();
            submitData.append('content', formData.content);
            submitData.append('author', formData.author);
            
            // Ajouter le fichier si sélectionné
            if (formData.coverFile) {
                submitData.append('cover', formData.coverFile);
            }

            if (selectedQuote) {
                await quoteService.updateQuote(selectedQuote.id, submitData);
                toast.success('Citation modifiée');
            } else {
                await quoteService.createQuote(submitData);
                toast.success('Citation créée');
            }

            setIsFormModalOpen(false);
            setPage(1);
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error?.message || 'Erreur lors de la soumission');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-8xl mx-2 px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Citations</h1>
                    <p className="text-gray-600 mt-1">Gérez toutes vos citations inspirantes</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nouvelle citation
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">💡</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Auteurs uniques</p>
                            <p className="text-3xl font-bold text-purple-600 mt-2">
                                {new Set(quotes.map(q => q.author)).size}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✍️</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Longueur moyenne</p>
                            <p className="text-3xl font-bold text-gray-600 mt-2">
                                {quotes.length > 0 
                                    ? Math.round(quotes.reduce((sum, q) => sum + q.content.length, 0) / quotes.length)
                                    : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Rechercher une citation..."
                />
            </div>

            {/* Content */}
            {isLoading ? (
                <LoadingSkeleton />
            ) : quotes.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">💡</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune citation</h3>
                    <p className="text-gray-600 mb-6">Commencez par créer votre première citation</p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Créer une citation
                    </button>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Citation</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Auteur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Longueur</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quotes.map((quote: any) => (
                                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="line-clamp-2">"{quote.content}"</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{quote.author}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{quote.content.length} chars</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(quote)}
                                                    title="Modifier"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(quote.id)}
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
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            {/* Form Modal */}
            <Modal2
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setCoverPreview(null);
                }}
                title={selectedQuote ? 'Modifier la citation' : 'Créer une nouvelle citation'}
                size="lg"
            >
                <form onSubmit={handleFormSubmit} className="space-y-6">
                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Contenu *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Entrez la citation inspirante"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.content.length}/1000 caractères
                        </p>
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Auteur *
                        </label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nom de l'auteur"
                        />
                    </div>

                    {/* Cover Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Image de couverture (optionnel)
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFormData({ ...formData, coverFile: file });
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setCoverPreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Formats acceptés: JPEG, PNG, WEBP (max 10 MB)
                        </p>
                        
                        {/* Image Preview */}
                        {coverPreview && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-600 mb-2">Aperçu:</p>
                                <img 
                                    src={coverPreview} 
                                    alt="Preview" 
                                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setIsFormModalOpen(false);
                                setCoverPreview(null);
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Traitement...' : selectedQuote ? 'Modifier' : 'Créer'}
                        </button>
                    </div>
                </form>
            </Modal2>
        </div>
    );
};

export default Quotes;