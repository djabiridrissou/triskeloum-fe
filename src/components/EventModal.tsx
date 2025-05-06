import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const EventModal = ({ event, isOpen, onClose }: any) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const serverUrl = import.meta.env.VITE_BASE_WITHOUT_ORIGIN || '';

  // Gestion de l'échappement avec la touche Escape
  useEffect(() => {
    const handleEsc = (e: any) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Empêcher le défilement du corps lorsque le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const eventDate = new Date(event.date);
  const hasMedia = event.media && event.media.length > 0;
  
  // Fonctions pour gérer la navigation dans le carrousel
  const nextMedia = () => {
    setActiveMediaIndex((prev) => 
      prev === event.media.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevMedia = () => {
    setActiveMediaIndex((prev) => 
      prev === 0 ? event.media.length - 1 : prev - 1
    );
  };

  // Déterminer le type de média (vidéo ou image)
  const isVideo = (url: string) => {
    return url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.mov');
  };

  // Construction des URLs complètes avec le serveur
  const getFullMediaUrl = (url: string) => {
    if (!url) return '';
    // Si l'URL est déjà absolue, la retourner telle quelle
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Sinon, préfixer avec l'URL du serveur
    return `${serverUrl}/${url}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white bg-opacity-90">
      <div className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-white border border-gray-200 shadow-xl">
        {/* Bouton de fermeture */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-600 hover:text-black transition-colors duration-300"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Section média (à gauche sur les grands écrans) */}
          <div className="w-full md:w-3/5 relative flex items-center justify-center bg-gray-100">
            {hasMedia ? (
              <div className="w-full h-full relative">
                {/* Carrousel de médias */}
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  {event.media.map((mediaUrl: any, index: number) => {
                    const fullUrl = getFullMediaUrl(mediaUrl);
                    
                    return (
                      <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          index === activeMediaIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        {isVideo(mediaUrl) ? (
                          <video 
                            src={fullUrl} 
                            className="w-full h-full object-contain" 
                            controls 
                          />
                        ) : (
                          <img 
                            src={fullUrl} 
                            alt={`Event media ${index + 1}`} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/800/450';
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Contrôles du carrousel (uniquement si plus d'un média) */}
                {event.media.length > 1 && (
                  <>
                    <button 
                      onClick={prevMedia} 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-70 transition-all duration-300 shadow"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextMedia} 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-2 rounded-full hover:bg-opacity-70 transition-all duration-300 shadow"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Indicateurs de position */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                      {event.media.map((_: any, index: any) => (
                        <button
                          key={index}
                          onClick={() => setActiveMediaIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === activeMediaIndex 
                              ? 'bg-black w-4' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No media available</p>
              </div>
            )}
          </div>
          
          {/* Section détails (à droite sur les grands écrans) */}
          <div className="w-full md:w-2/5 p-6 flex flex-col">
            <h2 className="text-2xl font-light mb-2 text-gray-900">{event.title}</h2>
            
            <div className="flex items-center mb-4 text-gray-600">
              <div className="mr-4">
                <div className="text-sm">
                  {eventDate.toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-sm">
                  {eventDate.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              {event.isNow && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                  Happening Now
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Host:</div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 mr-2">
                  {(event.studentId?.name?.charAt(0) || "?").toUpperCase()}
                </div>
                <span className="text-gray-900">{event.studentId?.name || "Unknown Host"}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Location:</div>
              <div className="text-gray-900">{event.location || "Online Event"}</div>
            </div>
            
            {event.description && (
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">Description:</div>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {event.description}
                </div>
              </div>
            )}
            
            {/* Info complémentaire et statut */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              {event.isCanceled ? (
                <div className="text-red-600 text-sm font-medium mb-4">
                  This event has been canceled.
                </div>
              ) : eventDate < new Date() ? (
                <div className="text-gray-500 text-sm mb-4">
                  This event has already taken place.
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;