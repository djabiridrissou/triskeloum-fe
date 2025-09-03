import React, { useState } from 'react';
import {
    Handshake,
    Globe,
    Shield,
    TrendingUp,
    Users,
    Building2,
    CheckCircle,
    ArrowRight,
    Award,
    Target,
    Zap,
    BarChart3
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
    const [activeMetric, setActiveMetric] = useState(0);

    const navigate = useNavigate();
    const metrics = [
        { value: "90%", label: "Taux de satisfaction visé", icon: <Target className="w-4 h-4" /> },
        { value: "100+", label: "Fournisseurs partenaires", icon: <Building2 className="w-4 h-4" /> },
        { value: "24/7", label: "Disponibilité plateforme", icon: <Zap className="w-4 h-4" /> },
        { value: "2025", label: "Année de lancement", icon: <Award className="w-4 h-4" /> }
    ];

    const features = [
        {
            icon: <Globe className="w-5 h-5" />,
            title: "Portée Internationale",
            description: "Connexion entre fournisseurs locaux et internationaux"
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Transactions Sécurisées",
            description: "Système de paiement fiable et traçabilité garantie"
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Réseau Vérifié",
            description: "Tous nos partenaires sont certifiés et validés"
        }
    ];

    return (
        <section className="py-0 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`,
                }}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                       {/*  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-6">
                            <Handshake className="w-4 h-4" />
                            <span>À propos de nous</span>
                        </div> */}
                        
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                           Qui sommes  <span className="text-green-600">nous ?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            La plateforme de confiance qui révolutionne le commerce B2B en Afrique
                        </p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                        {/* Left Content */}
                        <div className="space-y-6">
                            <div className="prose prose-lg text-gray-600">
                                <p className="leading-relaxed">
                                    <span className="font-semibold text-gray-900">Terminal d'Échanges (TE) </span> est née d’une 
                                        vision simple mais ambitieuse : créer une plateforme commerciale où TE, 
                                        en tant que fournisseur exclusif, collabore avec les revendeurs dans un climat de confiance.
                                </p>
                                <p className="leading-relaxed">
                                    Notre <span className="font-medium text-gray-900">Fiche d'Échanges</span> innovante 
                                    garantit la transparence et la sécurité de chaque transaction, permettant aux entreprises 
                                    de se concentrer sur leur croissance plutôt que sur les risques commerciaux.
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-4 mt-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <div className="text-gray-700">{feature.icon}</div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                            <p className="text-sm text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                          {/*   <div className="pt-4">
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-300 group">
                                    Découvrir la plateforme
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div> */}
                        </div>

                        {/* Right Content - Metrics Cards */}
                        <div className="relative">
                            {/* Background Circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full opacity-50 blur-3xl"></div>
                            
                            {/* Metrics Grid */}
                            <div className="relative grid grid-cols-2 gap-4">
                                {metrics.map((metric, index) => (
                                    <div
                                        key={index}
                                        className={`p-6 bg-white border rounded-xl cursor-pointer transition-all duration-300 ${
                                            activeMetric === index 
                                                ? 'border-gray-900 shadow-lg scale-105' 
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                        }`}
                                        onMouseEnter={() => setActiveMetric(index)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <div className="text-gray-700">{metric.icon}</div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {metric.value}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {metric.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Badge */}
                            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="font-semibold text-gray-900 text-sm">Notre Engagement</span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    Simplifier et sécuriser chaque échange commercial pour bâtir l'économie africaine de demain.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="mb-4 relative mt-20 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                                backgroundSize: '20px 20px'
                            }}></div>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Prêt à transformer votre commerce ?
                                </h3>
                                <p className="text-gray-300">
                                    Rejoignez des centaines d'entreprises qui font déjà confiance à Terminal d'Échanges
                                </p>
                            </div>
                            <div className="flex gap-3">
                              {/*   <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                    Devenir Fournisseur
                                </button> */}
                                <button onClick={() => navigate('/register?type=revendeur&step=0')} className="px-6 py-3 bg-transparent text-white font-medium rounded-lg border border-white/30 hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                                    Devenir Acheteur Grossiste
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;