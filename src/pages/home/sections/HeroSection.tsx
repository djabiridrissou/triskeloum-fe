import { useEffect, useState } from "react";
import StatCard from "../../../components/StatCard";
import { SearchOutlined } from "@ant-design/icons";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "Rechercher des produits, fournisseurs...",
    "Trouvez des composants électroniques...",
    "Découvrez des textiles de qualité...",
    "Explorez les cosmétiques tendance...",
    "Recherchez des vélos électriques..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000); // Change toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    console.log("Recherche:", searchQuery);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background fixe avec image A41 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/images/A13.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 " />
      </div>

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='white' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      {/* <div className="relative z-10 min-h-screen flex flex-col justify-center">
        <div className="px-4 py-[80px] md:py-40">
         
          <div className="ml-auto max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 md:mt-[180px]">

           
            <div className="text-right mb-8 md:mb-6">
              <p className="text-lg md:text-xl text-blue-800 leading-relaxed">
                Connectez-vous avec des milliers de fournisseurs et revendeurs dans le monde entier
              </p>
            </div>

      
            <div className="mb-8 md:mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholders[placeholderIndex]}
                  className="w-full px-4 md:px-6 py-3 md:py-4 text-gray-800 bg-white rounded-full border-none outline-none text-base md:text-lg placeholder-gray-500 transition-all duration-500 pr-12" // Ajout de pr-12 pour l'espace du bouton
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 transition-colors duration-200 flex items-center justify-center"
                  style={{ marginRight: '1px' }} // Petit margin entre l'input et le bouton
                >
                  <SearchOutlined className="w-5 h-5 md:w-6 md:h-6" /> Rechercher
                </button>
              </div>
            </div>

         
            <div className="text-right">
              <p className="text-white/80 mb-4 text-sm md:text-base">Fréquemment recherchés:</p>
              <div className="flex flex-wrap justify-end gap-2 md:gap-3">
                {["électronique", "textile", "cosmétiques", "vélos électriques"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-white/10 border border-white/30 rounded-full text-white/90 text-xs md:text-sm hover:bg-white/20 transition-colors duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-auto">
          <div className="container mx-auto px-4 pb-8 md:pb-12">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 md:gap-6 pb-4">
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='white' fill-opacity='0.05'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;