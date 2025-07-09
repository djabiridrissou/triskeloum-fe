import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ProductCardPremium from "../../../components/ProductCardPremium";
import { useGetProductsQuery } from "../../../services/api";

const CatalogueSection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const { data: products, isLoading } = useGetProductsQuery({});
    
    // Assurer que products.data est toujours un tableau
    const productsData = Array.isArray(products?.data) ? products.data : [];

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
                    <div className="relative shadow-xl px-2 py-1 rounded-xl">
                        <div className="hidden md:flex justify-end items-center mb-8">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    disabled={currentSlide === 0}
                                    className={`p-2 rounded-full transition-all duration-200 ${
                                        currentSlide === 0
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
                                    className={`p-2 rounded-full transition-all duration-200 ${
                                        currentSlide === totalSlides - 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-md'
                                    }`}
                                    aria-label="Suivant"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div 
                            ref={sliderRef}
                            className="overflow-hidden"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            <div 
                                className={`flex transition-transform duration-300 ease-out ${
                                    isTransitioning ? '' : 'transition-none'
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
                                        <div className={`grid gap-6 h-full ${
                                            slidesPerView === 1 ? 'grid-cols-1' :
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
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        index === currentSlide
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
        </section>
    );
};

export default CatalogueSection;