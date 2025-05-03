import React, { createContext, useState, useEffect, useContext } from 'react';

// Création du contexte pour le thème
export const ThemeContext = createContext();

// Hook personnalisé pour utiliser le thème
export const useTheme = () => useContext(ThemeContext);

// Fournisseur de thème qui enveloppe l'application
export const ThemeProvider = ({ children }) => {
  // Récupération du thème depuis le localStorage ou utilisation du thème clair par défaut
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Mise à jour du DOM et du localStorage lorsque le thème change
  useEffect(() => {
    // Mise à jour de la classe sur l'élément HTML pour appliquer les styles CSS
    document.documentElement.classList.toggle('dark', darkMode);
    
    // Sauvegarde du thème dans le localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Fonction pour basculer le thème
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Valeurs exposées dans le contexte
  const value = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};