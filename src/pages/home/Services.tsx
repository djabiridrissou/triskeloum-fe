import React, { useEffect, useState } from 'react';
import { CheckCircle, Users, Globe, Shield, ArrowRight, FileText, CreditCard, Clock, Star, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function Services() {
    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [activeTab, setActiveTab] = useState('fournisseurs');

    const paymentMethods: any = [
        {
            id: 'MIXX_BY_YAS',
            name: 'Mixx by Yas',
            icon: <img src="/images/mixx.png" className="w-12 h-12 object-contain" />,
            available: true
        },
        {
            id: 'FLOOZ',
            name: 'Flooz',
            icon: <img src="/images/flooz.png" className="w-12 h-12 object-contain" />,
            available: true
        },
        { ID: 'NSIA', name: "NSIA Banque",  icon: <CreditCard className="w-6 h-6" />, available: true },
       

    ];

    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Traçabilité Complète",
            description: "Suivi transparent de toutes vos transactions commerciales"
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            title: "Validation Automatique",
            description: "Vérification instantanée des informations saisies"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Historique Détaillé",
            description: "Accès complet à l'historique de tous vos échanges"
        }
    ];

    const pricingPlans = [
        {
            type: "Fournisseurs Nationaux",
            price: "50,000",
            currency: "FCFA",
            features: ["Inscription complète", "Gestion de stock", "Support client", "Historique détaillé"],
            url: '/register?type=fournisseur-national&step=2'
        },
        {
            type: "Fournisseurs Internationaux",
            price: "100,000",
            currency: "FCFA",
            features: ["Inscription complète", "Gestion de stock", "Support prioritaire", "Outils avancés", "Export international"],
            url: '/register?type=fournisseur-international&step=1'
        },
        {
            type: "Revendeurs",
            price: "20,000",
            currency: "FCFA",
            features: ["Accès aux commandes", "Catalogue complet", "Support client", "Suivi en temps réel"],
            url: '/register?type=revendeur&step=3'
        }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="overflow-x-hidden">
                <div className="">
                    {/* Process Section */}
                    <div className="py-20 bg-gradient-to-r from-blue-50 to-green-50 flex justify-between">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Comment ça fonctionne ?
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Un processus simple et sécurisé en quelques étapes
                                </p>
                            </div>

                            {/* Tab Navigation */}
                            <div className="flex justify-center mb-12">
                                <div className="bg-white p-2 rounded-xl shadow-lg">
                                    <button
                                        onClick={() => setActiveTab('fournisseurs')}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'fournisseurs'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'text-gray-600 hover:text-blue-500'
                                            }`}
                                    >
                                        <Users className="w-5 h-5 inline mr-2" />
                                        Fournisseurs
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('revendeurs')}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === 'revendeurs'
                                            ? 'bg-green-500 text-white shadow-md'
                                            : 'text-gray-600 hover:text-green-500'
                                            }`}
                                    >
                                        <Globe className="w-5 h-5 inline mr-2" />
                                        Revendeurs
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                {activeTab === 'fournisseurs' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold text-gray-900 text-center">
                                            Processus d'inscription Fournisseurs
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Inscription & Paiement</h4>
                                                        <p className="text-gray-600 text-sm">Remplissez le formulaire et effectuez le paiement selon votre catégorie</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Gestion de Stock</h4>
                                                        <p className="text-gray-600 text-sm">Ajoutez vos marchandises et quantités disponibles</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Validation & Publication</h4>
                                                        <p className="text-gray-600 text-sm">Votre stock est publié et accessible aux revendeurs</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                                                <h5 className="font-semibold text-gray-900 mb-4">Informations requises :</h5>
                                                <ul className="space-y-2 text-sm text-gray-600">
                                                    <li>• Raison sociale et N° RCCM</li>
                                                    <li>• N° NIF et coordonnées complètes</li>
                                                    <li>• Informations du représentant</li>
                                                    <li>• Pièce d'identité valide</li>
                                                    <li>• Référence de paiement</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'revendeurs' && (
                                    <div className="space-y-8">
                                        <h3 className="text-2xl font-bold text-gray-900 text-center">
                                            Processus de commande Revendeurs
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Inscription Revendeur</h4>
                                                        <p className="text-gray-600 text-sm">Créez votre compte avec vos informations commerciales</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Passer Commande</h4>
                                                        <p className="text-gray-600 text-sm">Parcourez le catalogue et sélectionnez vos marchandises</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Paiement Sécurisé</h4>
                                                        <p className="text-gray-600 text-sm">Payez la totalité ou la moitié du montant</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                                                <h5 className="font-semibold text-gray-900 mb-4">Avantages revendeurs :</h5>
                                                <ul className="space-y-2 text-sm text-gray-600">
                                                    <li>• Calcul automatique des prix</li>
                                                    <li>• Paiement flexible (75% ou 100%)</li>
                                                    <li>• Accès au catalogue complet</li>
                                                    <li>• Suivi de commande en temps réel</li>
                                                    <li>• Support client dédié</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='hidden md:block'>
                            <img src="/images/A2.jpg" alt="" />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Tarifs Transparents
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Des prix justes et adaptés à chaque type d'acteur
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {pricingPlans.map((plan, index) => (
                                    <div key={index} className={`relative p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${index === 1
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl transform scale-105'
                                        : 'bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-xl'
                                        }`}>
                                        {index === 1 && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                                    Populaire
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-center mb-8">
                                            <h3 className={`text-lg font-semibold mb-2 ${index === 1 ? 'text-white' : 'text-gray-900'}`}>
                                                {plan.type}
                                            </h3>
                                            <div className="flex items-baseline justify-center">
                                                <span className={`text-4xl font-bold ${index === 1 ? 'text-white' : 'text-gray-900'}`}>
                                                    {plan.price}
                                                </span>
                                                <span className={`text-lg ml-2 ${index === 1 ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {plan.currency}
                                                </span>
                                            </div>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-center">
                                                    <CheckCircle className={`w-5 h-5 mr-3 ${index === 1 ? 'text-green-300' : 'text-green-500'
                                                        }`} />
                                                    <span className={index === 1 ? 'text-blue-100' : 'text-gray-600'}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <button onClick={() => navigate(plan.url, { replace: true })} className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${index === 1
                                            ? 'bg-white text-blue-600 hover:bg-gray-100'
                                            : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg transform hover:-translate-y-1'
                                            }`}>
                                            Choisir ce plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div
                        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
                        style={{
                            backgroundImage: "url('/images/container.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black/50"></div> {/* Overlay noir pour lisibilité */}
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 text-green-100 text-sm font-medium mb-6">
                                    <Star className="w-4 h-4 mr-2" />
                                    Service Premium - 99% de satisfaction client
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                                    FICHE D'ÉCHANGES
                                </h1>
                                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                                    Le système de gestion transparent qui révolutionne vos relations commerciales entre fournisseurs et revendeurs
                                </p>

                            </div>
                        </div>
                    </div>


                    {/* Features Section */}
                    <div className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    Pourquoi choisir notre Fiche d'Échanges ?
                                </h2>
                                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                    Un système conçu pour créer une confiance maximale entre tous les acteurs de votre écosystème commercial
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="group p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Payment Methods */}
                    <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Moyens de Paiement Acceptés
            </h2>
            <p className="text-gray-600">
                Plusieurs options pour votre confort et sécurité
            </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {paymentMethods.map((method) => (
                <div
                    key={method.id}
                    className={`relative bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                        method.available 
                            ? 'border-gray-200 hover:border-blue-300' 
                            : 'border-gray-200 opacity-60'
                    }`}
                >
                    {/* Badge de disponibilité */}
                    <div className="absolute -top-2 -right-2">
                        {method.available ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        ) : (
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>
                    
                    {/* Contenu de la carte */}
                    <div className="flex flex-col items-center text-center h-full">
                        {/* Icône */}
                        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-50 rounded-lg">
                            {method.icon}
                        </div>
                        
                        {/* Nom */}
                        <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                            {method.name}
                        </h3>
                        
                        {/* Statut */}
                        <div className={`text-xs px-3 py-1 rounded-full font-medium ${
                            method.available 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                        }`}>
                            {method.available ? 'Disponible' : 'Bientôt disponible'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Note informative */}
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
                Tous les paiements sont sécurisés et protégés par un cryptage SSL
            </p>
        </div>
    </div>
</div>

                    {/* CTA Section */}
                    <div style={{
                        backgroundImage: "url('/images/markt1.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
                        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Prêt à révolutionner vos échanges commerciaux ?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8">
                                Rejoignez les entreprises qui font déjà confiance à Terminal d'Échanges
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => navigate("/register")} className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    <Users className="w-5 h-5 mr-2" />
                                    Devenir Fournisseur
                                </button>
                                <button onClick={() => navigate("/register")} className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    <Globe className="w-5 h-5 mr-2" />
                                    Devenir Revendeur
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}