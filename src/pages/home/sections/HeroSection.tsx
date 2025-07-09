import { useEffect, useState } from "react";
import StatCard from "../../../components/StatCard";
import { ArrowRight, Zap, Users, ShoppingCart, TrendingUp, Globe } from "lucide-react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Connectez Fournisseurs & Revendeurs",
      subtitle: "La plateforme B2B qui révolutionne vos échanges commerciaux",
      cta: "Commencer maintenant",
      bgImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&h=1080&fit=crop&auto=format",
    },
    {
      title: "Gestion Transparente & Sécurisée",
      subtitle: "Notre FICHE D'ÉCHANGES garantit 90% de satisfaction",
      cta: "Découvrir nos services",
      bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop&auto=format",
    },
    {
      title: "Catalogue Mondial de Marchandises",
      subtitle: "Accédez à un réseau international de fournisseurs vérifiés",
      cta: "Explorer le catalogue",
      bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=1080&fit=crop&auto=format",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background avec images défilantes */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='white' fill-opacity='0.05'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 py-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Texte principal */}
          <div className="text-white space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-900 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              Plateforme B2B Innovante
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block">{slides[currentSlide].title.split(" ")[0]}</span>
              <span className="block text-green-300">
                {slides[currentSlide].title.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-300 transition-all duration-300 flex items-center justify-center gap-2"
                aria-label={slides[currentSlide].cta}
              >
                {slides[currentSlide].cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                aria-label="Voir la démo"
              >
                Voir la démo
              </button>
            </div>

            {/* Indicateurs de slides */}
            <div className="flex gap-2 pt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-green-300 w-8" : "bg-white/30 w-3"
                  }`}
                  aria-label={`Aller au slide ${index + 1}`}
                  aria-current={index === currentSlide ? "true" : "false"}
                />
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Fournisseurs"
                value="500+"
                description="Nationaux & Internationaux"
              />
              <StatCard
                icon={<ShoppingCart className="w-8 h-8" />}
                title="Revendeurs"
                value="1200+"
                description="Actifs sur la plateforme"
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Satisfaction"
                value="90%"
                description="Taux de satisfaction"
              />
              <StatCard
                icon={<Globe className="w-8 h-8" />}
                title="Pays"
                value="15+"
                description="Réseau international"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;