import React, { useState } from 'react';
import { X, Mail, User, MessageSquare, Send } from 'lucide-react';
import { useSendContactEmailMutation } from '../../../services/api';
import Swal from 'sweetalert2';

const CTASection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState<any>({});
    const [sendMessage, { isLoading }] = useSendContactEmailMutation();

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        } else if (formData.message.trim().length < 122) {
            newErrors.message = 'Le message doit contenir au moins 122 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            // Données à envoyer
            const dataToSend = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                message: formData.message.trim()
            };


            await sendMessage(dataToSend).unwrap();
            Swal.fire({
                icon: 'success',
                title: 'Message envoyé avec succès',
                text: 'Nous vous contacterons bientôt.',
                confirmButtonText: 'OK'
            });
            setIsModalOpen(false);
            setFormData({ name: '', email: '', message: '' });
            setErrors({});
        } catch (error: any) {
            console.error('Erreur lors de l\'envoi du message:', error);
            if (error?.data?.message) {
                alert(`Erreur: ${error.data.message}`);
            } else if (error?.message) {
                alert(`Erreur: ${error.message}`);
            } else {
                alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
            }
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev: any) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <>
            <section
                className="py-20 px-4 relative overflow-hidden"
                style={{
                    backgroundImage: 'url("https://images.pexels.com/photos/7621366/pexels-photo-7621366.jpeg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Overlay pour améliorer la lisibilité */}
                <div className="absolute inset-0  bg-opacity-50"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-6">
                        Prêt à Révolutionner Vos Échanges ?
                    </h2>
                    <p className="text-xl text-white mb-8">
                        Rejoignez dès maintenant les milliers d'entreprises qui font confiance à Terminal d'Échanges
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => { window.location.href = '/register' }}
                            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Commencer maintenant
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Contactez-nous
                        </button>
                    </div>
                </div>
            </section>

            {/* Modal Contact */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0  bg-opacity-60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
                        {/* Header */}
                        <div className="text-black p-6 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-6 h-6" />
                                    <h3 className="text-xl font-semibold">Envoyez nous un message</h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-blue-600 text-sm mt-2">
                                Nous sommes là pour vous aider
                            </p>
                        </div>

                        {/* Form */}
                        <div className="p-6 space-y-4">
                            {/* Nom */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">

                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Votre nom complet"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">

                                    Adresse email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="votre@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">

                                    Message
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Décrivez votre projet ou vos besoins... (minimum 122 caractères)"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.message && (
                                        <p className="text-red-500 text-xs">{errors.message}</p>
                                    )}
                                    <p className={`text-xs ml-auto ${formData.message.length < 122 ? 'text-red-500' : 'text-green-600'
                                        }`}>
                                        {formData.message.length}/122
                                    </p>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:from-blue-700 hover:to-green-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Envoi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Envoyer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CTASection;