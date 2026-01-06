import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useGetLandingPageContentQuery } from '../../../services/api';

const BioGeometrySection = () => {
  const { lang, t } = useLanguage();
  const { data: contentData } = useGetLandingPageContentQuery();
  const contactSection = contentData?.payload?.find((section: any) => section.section === 'contact');
  const whatsapp = contactSection?.metadata?.whatsapp || '22890000000';


  const benefits = [
    {
      iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      titleFr: "Harmonisation du domicile",
      titleEn: "Home Harmonization",
      descFr: "Transformez votre maison en sanctuaire de repos et de guérison.",
      descEn: "Transform your home into a sanctuary of rest and healing.",
    },
    {
      iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      titleFr: "Protection EMF",
      titleEn: "EMF Protection",
      descFr: "Neutralisez les effets des rayonnements électromagnétiques.",
      descEn: "Neutralize the effects of electromagnetic radiation.",
    },
    {
      iconPath: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      titleFr: "Équilibre énergétique",
      titleEn: "Energy Balance",
      descFr: "Rétablissez la dynamique énergétique naturelle du bien-être.",
      descEn: "Restore the natural energy dynamics of well-being.",
    },
    {
      iconPath: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
      titleFr: "Rayonnement géopathique",
      titleEn: "Geopathic Radiation",
      descFr: "Identifiez et corrigez les perturbations telluriques.",
      descEn: "Identify and correct telluric disturbances.",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-purple-950/10 to-black overflow-hidden">
      {/* Animated Sacred Geometry Background */}
      <div className="absolute inset-0">
        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]" viewBox="0 0 400 400">
          <g className="animate-spin-slower origin-center">
            {/* Metatron's Cube simplified */}
            <circle cx="200" cy="200" r="150" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="100" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="50" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <line
                key={angle}
                x1="200"
                y1="200"
                x2={200 + 150 * Math.cos(angle * Math.PI / 180)}
                y2={200 + 150 * Math.sin(angle * Math.PI / 180)}
                stroke="#D4AF37"
                strokeWidth="0.5"
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-xs tracking-[0.3em] text-amber-500 border border-amber-600/30 rounded-full">
            {t('SCIENCE VIBRATOIRE', 'VIBRATIONAL SCIENCE')}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
            {t('La BioGéométrie', 'BioGeometry')}
          </h2>
          <p className="max-w-3xl mx-auto text-gray-400">
            {t(
              "Science environnementale moderne créée par l'Architecte égyptien Dr Ibrahim Karim, la BioGéométrie utilise les principes énergétiques des formes géométriques pour harmoniser les systèmes biologiques.",
              "Modern environmental science created by Egyptian Architect Dr Ibrahim Karim, BioGeometry uses the energetic principles of geometric shapes to harmonize biological systems."
            )}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* BG3 Symbol Animation */}
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="bgGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer circle */}
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#bgGold)" strokeWidth="1" opacity="0.3" />

                {/* Inner rotating elements */}
                <g filter="url(#glow)" className="animate-spin-slow origin-center" style={{ transformOrigin: '100px 100px' }}>
                  {/* Vesica Piscis */}
                  <circle cx="70" cy="100" r="50" fill="none" stroke="url(#bgGold)" strokeWidth="1.5" />
                  <circle cx="130" cy="100" r="50" fill="none" stroke="url(#bgGold)" strokeWidth="1.5" />
                </g>

                {/* Center elements */}
                <g className="animate-pulse">
                  <circle cx="100" cy="100" r="15" fill="none" stroke="url(#bgGold)" strokeWidth="2" />
                  <circle cx="100" cy="100" r="5" fill="url(#bgGold)" />
                </g>

                {/* BG3 text */}
                <text x="100" y="180" textAnchor="middle" fill="#D4AF37" fontSize="12" fontWeight="bold" letterSpacing="4">BG3</text>
              </svg>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-amber-900/20 to-transparent border-l-2 border-amber-500 rounded-r-xl">
              <h3 className="text-xl text-amber-400 mb-3">{t("L'énergie-qualité BG3", "BG3 Energy-Quality")}</h3>
              <p className="text-gray-300">
                {t(
                  "Cette clé énergétique est présente au centre du système énergétique de la Terre, de l'Univers et de tous les êtres vivants. Elle est concentrée dans les lieux sacrés reconnus depuis l'aube de l'humanité comme centres de guérison.",
                  "This energy key is present at the center of Earth's energy system, the Universe, and all living beings. It is concentrated in sacred places recognized since the dawn of humanity as healing centers."
                )}
              </p>
            </div>

            <p className="text-gray-400 leading-relaxed">
              {t(
                "Nos environnements domestiques modernes nous déconnectent de la dynamique énergétique naturelle. En tant que systèmes énergétiques ouverts, nous sommes submergés par les perturbations : rayonnements électromagnétiques, stress géopathique, matériaux toxiques...",
                "Our modern home environments disconnect us from natural energy dynamics. As open energy systems, we are overwhelmed by disturbances: electromagnetic radiation, geopathic stress, toxic materials..."
              )}
            </p>

            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900/30 border border-amber-600/50 rounded-full text-amber-400 hover:bg-amber-800/40 transition-all duration-300"
            >
              {t('Demander une étude', 'Request a study')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="group p-6 bg-black/50 border border-amber-900/30 rounded-2xl hover:border-amber-600/50 hover:bg-amber-900/10 transition-all duration-300"
            >
              <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-amber-600/20 to-amber-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={benefit.iconPath} />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-white mb-2">{t(benefit.titleFr, benefit.titleEn)}</h4>
              <p className="text-sm text-gray-400">{t(benefit.descFr, benefit.descEn)}</p>
            </div>
          ))}
        </div>

        {/* Price Note */}
        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900/10 border border-amber-700/30 rounded-full text-amber-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('Solutions à domicile - Prix sur demande', 'Home solutions - Price on request')}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-slower { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slower { animation: spin-slower 60s linear infinite; }
        .animate-spin-slow { animation: spin-slower 30s linear infinite; }
      `}</style>
    </section>
  );
};

export default BioGeometrySection;