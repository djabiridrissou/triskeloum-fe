import { useEffect, useState } from "react";
import StatCard from "../../../components/StatCard";
import { ArrowRight, Zap, Users, ShoppingCart, TrendingUp, Globe } from "lucide-react";
import A13Image from "../../../../public/images/A13.jpg";
import A41Image from "../../../../public/images/A41.jpg";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "",
      subtitle: "",
      cta: "",
      bgImage: A13Image,
    },
    {
      title: "",
      subtitle: "",
      cta: "",
      bgImage: A41Image,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
              backgroundImage: `url(${slide.bgImage})`, // Utilisez .src pour les images importées
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden={index !== currentSlide}
          >
            <div className="absolute inset-0 bg-black/30" /> {/* Réduit l'opacité du filtre noir */}
          </div>
        ))}
        <div
          className="absolute inset-0 opacity-20" 
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
          {/* Texte principal - masqué mais gardé pour la structure */}
          <div className="text-white space-y-8 opacity-0">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block">{slides[currentSlide].title.split(" ")[0]}</span>
              <span className="block text-green-300">
                {slides[currentSlide].title.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Statistiques */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <StatCard
                icon={<Users className="w-8 h-8" />}
                title="Fournisseurs"
                value="500+"
                description="Nationaux & Internationaux"
                darkMode
              />
              <StatCard
                icon={<ShoppingCart className="w-8 h-8" />}
                title="Revendeurs"
                value="1200+"
                description="Actifs sur la plateforme"
                darkMode
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8" />}
                title="Satisfaction"
                value="90%"
                description="Taux de satisfaction"
                darkMode
              />
              <StatCard
                icon={<Globe className="w-8 h-8" />}
                title="Pays"
                value="15+"
                description="Réseau international"
                darkMode
              />
            </div>
          </div>
        </div>

        {/* Indicateurs de slides centrés en bas */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
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
    </section>
  );
};

export default HeroSection;