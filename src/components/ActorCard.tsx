import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const ActorCard = ({ type, price, icon, color, popular, isContact, contactType, url, onContact }: any) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isContact && onContact) {
      onContact(contactType);
    } else if (!isContact && url) {
      navigate(url, { replace: true });
      window.scrollTo(0, 0);
    }
  };

  // Bénéfices pour la carte Acheteur Grossiste
  const benefits = [
    "Accès au catalogue complet",
    "Commandes simplifiées",
    "Paiement flexible",
    "Suivi des commandes"
  ];

  const isAcheteurGrossiste = type === "Acheteur Grossiste";

  return (
    <div className={`group relative overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 ${popular ? "ring-2 ring-green-500/20 shadow-lg" : "hover:border-gray-200"} h-full flex flex-col`}>
      
      {/* Badge Populaire */}
      {popular && (
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            Populaire
          </div>
        </div>
      )}

      {/* Header avec dégradé subtil */}
      <div className={`relative h-24 bg-gradient-to-br ${color} opacity-5`}>
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative -mt-12 px-8 pb-8 flex-1 flex flex-col">
        
        {/* Icône */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg mb-6 group-hover:scale-105 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {type}
        </h3>

        {/* Prix */}
        {price && (
          <div className="mb-6">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {price}
            </span>
          </div>
        )}

        {/* Contenu flexible qui s'adapte */}
        <div className="flex-1 flex flex-col">
          {/* Bénéfices pour Acheteur Grossiste */}
          {isAcheteurGrossiste && (
            <div className="mb-8 space-y-3 flex-1">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Description enrichie pour autres types */}
          {!isAcheteurGrossiste && (
            <div className="mb-8 flex-1 flex flex-col justify-center">
              {!price ? (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {isContact ? "Contactez-nous pour plus d'informations sur nos conditions de partenariat" : "Rejoignez notre réseau de partenaires"}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span>Conditions préférentielles</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span>Support personnalisé</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span>Formation incluse</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Inscription et accès complet à la plateforme de distribution
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span>Interface intuitive</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      <span>Gestion centralisée</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bouton d'action - toujours en bas */}
        <button
          onClick={handleClick}
          className={`group/btn w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 mt-auto ${
            popular
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
              : isContact
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/25"
          }`}
        >
          <span>{isContact ? 'Nous contacter' : isAcheteurGrossiste ? "S'inscrire" : "Commencer"}</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>

      </div>

      {/* Effet de hover subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ActorCard;