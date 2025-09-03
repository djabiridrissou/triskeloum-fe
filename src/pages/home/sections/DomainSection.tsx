import { useRef, useState, useEffect } from 'react';
import {
    ShoppingCart,
    Smartphone,
    Shirt,
    Home,
    Car,
    Zap,
    FileText,
    Gamepad2,
    Shield,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react";

const DomainsSection = () => {
    const domains = [
        {
            id: 1,
            title: "Alimentation & Boissons",
            description: "Produits alimentaires, boissons et articles de consommation",
            icon: <ShoppingCart className="w-5 h-5" />,
            categories: ["Alimentation générale", "Boissons", "Produits de la mer", "Épices et condiments"]
        },
        {
            id: 2,
            title: "Technologies & Électronique",
            description: "High-tech, téléphonie et équipements électroniques",
            icon: <Smartphone className="w-5 h-5" />,
            categories: ["Téléphonie & High-Tech", "Électroménager", "Informatique & Réseau", "Objets connectés"]
        },
        {
            id: 3,
            title: "Mode & Beauté",
            description: "Vêtements, accessoires et produits de beauté",
            icon: <Shirt className="w-5 h-5" />,
            categories: ["Mode & Accessoires", "Hygiène & Beauté", "Textile", "Cosmétiques naturels"]
        },
        {
            id: 4,
            title: "Maison & Habitat",
            description: "Construction, bricolage et aménagement intérieur",
            icon: <Home className="w-5 h-5" />,
            categories: ["Maison & Bricolage", "Matériaux de construction", "Jardinage & Agriculture urbaine", "Décoration"]
        },
        {
            id: 5,
            title: "Automobile & Transport",
            description: "Véhicules, pièces détachées et accessoires",
            icon: <Car className="w-5 h-5" />,
            categories: ["Automobile & Pièces détachées", "Produits maritimes", "Transport logistique"]
        },
        {
            id: 6,
            title: "Énergie & Équipements",
            description: "Solutions énergétiques et équipements industriels",
            icon: <Zap className="w-5 h-5" />,
            categories: ["Énergie & Équipements", "Produits chimiques et industriels", "Énergie renouvelable"]
        },
        {
            id: 7,
            title: "Bureau & Services",
            description: "Fournitures de bureau et services professionnels",
            icon: <FileText className="w-5 h-5" />,
            categories: ["Papeterie & Fournitures", "Produits pharmaceutiques", "Services B2B"]
        },
        {
            id: 8,
            title: "Loisirs & Culture",
            description: "Divertissement, artisanat et produits culturels",
            icon: <Gamepad2 className="w-5 h-5" />,
            categories: ["Produits culturels & Divertissement", "Produits artisanaux & Loisirs", "Élevages et produits animaux"]
        },
        {
            id: 9,
            title: "Informatique & Sécurité",
            description: "Solutions IT et systèmes de surveillance",
            icon: <Shield className="w-5 h-5" />,
            categories: ["Informatique & Réseau", "Sécurité et surveillance", "Cybersécurité"]
        }
    ];

    const CategoryScroller = ({ categories }: any) => {
        const scrollRef: any = useRef(null);
        const [showLeftArrow, setShowLeftArrow] = useState(false);
        const [showRightArrow, setShowRightArrow] = useState(false);

        useEffect(() => {
            const checkScroll = () => {
                if (scrollRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                    setShowLeftArrow(scrollLeft > 0);
                    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
                }
            };

            checkScroll();
            const element: any = scrollRef.current;
            if (element) {
                element.addEventListener('scroll', checkScroll);
                window.addEventListener('resize', checkScroll);
                return () => {
                    element.removeEventListener('scroll', checkScroll);
                    window.removeEventListener('resize', checkScroll);
                };
            }
        }, [categories]);

        const scroll = (direction: any) => {
            if (scrollRef.current) {
                const scrollAmount = 150;
                scrollRef.current.scrollBy({
                    left: direction === 'left' ? -scrollAmount : scrollAmount,
                    behavior: 'smooth'
                });
            }
        };

        return (
            <div className="relative group">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white/95 backdrop-blur rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                    >
                        <ChevronLeft className="w-3 h-3 text-gray-700" />
                    </button>
                )}

                {/* Categories Container */}
                <div 
                    ref={scrollRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((category: any, index: any) => (
                        <span 
                            key={index} 
                            className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200 whitespace-nowrap hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                        >
                            {category}
                        </span>
                    ))}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white/95 backdrop-blur rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                    >
                        <ChevronRight className="w-3 h-3 text-gray-700" />
                    </button>
                )}
            </div>
        );
    };

    const handleDomainClick = (domain: any) => {
        console.log('Domain clicked:', domain);
        // Navigate logic here
    };

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Nos Domaines <span className="text-green-600">d'Activité</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Découvrez notre large gamme de produits et services répartis dans tous les secteurs d'activité
                    </p>
                </div>

                {/* Domains Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {domains.map((domain) => (
                        <div
                            key={domain.id}
                            onClick={() => handleDomainClick(domain)}
                            className="group relative bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-gray-300"
                        >
                            {/* Header with Icon */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300">
                                    <div className="text-gray-700 group-hover:text-white transition-colors duration-300">
                                        {domain.icon}
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-800">
                                        {domain.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {domain.description}
                                    </p>
                                </div>
                            </div>

                            {/* Categories with horizontal scroll */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <CategoryScroller categories={domain.categories} />
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DomainsSection;