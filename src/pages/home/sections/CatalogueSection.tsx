import { ChevronLeft, ChevronRight, Eye, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ProductCardPremium from "../../../components/ProductCardPremium";
import { useGetProductsQuery } from "../../../services/api";
import { useNavigate } from "react-router-dom";

const CatalogueSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const { data: products, isLoading } = useGetProductsQuery({});
    const productsData = Array.isArray(products?.data) ? products.data : [];
    const navigate = useNavigate();

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');

        setIsUserLoggedIn(!!(userEmail && userRole && userName));
    }, []);

    const getSlidesPerView = () => {
        if (typeof window === 'undefined') return 1;
        const width = window.innerWidth;
        if (width < 640) return 1;
        if (width < 768) return 2;
        if (width < 1024) return 3;
        return 4;
    };

    const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

    useEffect(() => {
        const handleResize = () => {
            setSlidesPerView(getSlidesPerView());
            setCurrentSlide(0);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.ceil(productsData.length / slidesPerView) || 1;
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentSlide < totalSlides - 1) {
            nextSlide();
        } else if (isRightSwipe && currentSlide > 0) {
            prevSlide();
        }
    };

    const nextSlide = () => {
        if (isTransitioning || currentSlide >= totalSlides - 1) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => prev + 1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const prevSlide = () => {
        if (isTransitioning || currentSlide <= 0) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => prev - 1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning || index < 0 || index >= totalSlides) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const getProductsForSlide = (slideIndex: number) => {
        const startIndex = slideIndex * slidesPerView;
        const endIndex = startIndex + slidesPerView;
        return productsData.slice(startIndex, endIndex);
    };

    // Fonction pour gérer la redirection intelligente
    const handleViewMore = () => {
        if (isUserLoggedIn) {
            navigate("/catalogue");
        } else {
            navigate("/login");
        }
    };

    const handleBecomePartner = () => {
        if (isUserLoggedIn) {
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    if (isLoading) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <p>Chargement du catalogue...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Notre <span className="text-green-600">Catalogue</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Découvrez notre vaste sélection de produits de qualité,
                        soigneusement sélectionnés par nos fournisseurs partenaires
                    </p>
                </div>

                {productsData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Aucun produit disponible pour le moment</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className=" md:flex justify-between items-center mb-8">
                            {/* Bouton Voir Plus à gauche */}
                            <span
                                onClick={handleViewMore}
                                className="inline-flex items-center px-6 py-3 text-black cursor-pointer font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
                            >
                                Voir plus 
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>

                            {/* Contrôles de navigation à droite */}
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    className={`p-2 rounded-full transition-all duration-200 ${currentSlide === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-md'
                                        }`}
                                    aria-label="Précédent"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    disabled={currentSlide === totalSlides - 1}
                                    className={`p-2 rounded-full transition-all duration-200 ${currentSlide === totalSlides - 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-md'
                                        }`}
                                    aria-label="Suivant"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Version mobile du bouton Voir Plus */}
                      {/*   <div className="md:hidden text-center mb-6">
                            <button
                                onClick={handleViewMore}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 group"
                            >
                                <Eye className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                Voir plus
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div> */}

                        <div
                            ref={sliderRef}
                            className="overflow-hidden"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <div
                                className={`flex transition-transform duration-300 ease-out ${isTransitioning ? '' : 'transition-none'
                                    }`}
                                style={{
                                    transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
                                    width: `${totalSlides * 100}%`
                                }}
                            >
                                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                    <div
                                        key={slideIndex}
                                        className="flex-shrink-0"
                                        style={{ width: `${100 / totalSlides}%` }}
                                    >
                                        <div className={`grid gap-6 h-full ${slidesPerView === 1 ? 'grid-cols-1' :
                                            slidesPerView === 2 ? 'grid-cols-2' :
                                                slidesPerView === 3 ? 'grid-cols-3' :
                                                    'grid-cols-4'
                                            }`}>
                                            {getProductsForSlide(slideIndex).map((product: any) => (
                                                <div key={product._id} className="h-full">
                                                    <ProductCardPremium product={product} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center mt-8 gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                                        ? 'bg-green-600 w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Aller au slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="md:hidden text-center mt-4">
                            <p className="text-sm text-gray-500">
                                Glissez pour voir plus de produits
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Section CTA avec logique de redirection intelligente */}
            <div className="flex items-center justify-center mt-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-black to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                    {/*   <button 
                        onClick={handleBecomePartner} 
                        className="cursor-pointer relative px-8 py-4 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold text-lg rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:-translate-y-2 active:scale-105 active:translate-y-0 group-hover:shadow-pink-500/50 animate-gradient-x uppercase tracking-wider"
                    >
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </div>

                       
                        <span className="relative flex items-center gap-3">
                            <span className="text-2xl animate-bounce">🚀</span>
                            {isUserLoggedIn ? 'Accéder au tableau de bord' : 'Devenez partenaire'}
                            <span className="text-2xl animate-pulse">✨</span>
                        </span>

                       
                        <div className="absolute top-1 left-4 w-2 h-2 bg-white rounded-full animate-ping opacity-80"></div>
                        <div className="absolute top-3 right-6 w-1 h-1 bg-yellow-300 rounded-full animate-ping animation-delay-500 opacity-90"></div>
                        <div className="absolute bottom-2 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping animation-delay-1000 opacity-70"></div>
                    </button> */}
                </div>

                <style>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
            </div>

        </section>
    );
};

export default CatalogueSection;