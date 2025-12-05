import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const FormationsSection = () => {
  const { lang, t } = useLanguage();
  const [showXof, setShowXof] = useState(false);
  const formatPrice = (eur: any, xof: any) => showXof ? `${xof.toLocaleString()} XOF` : `${eur.toLocaleString()} €`;

  const formations = [
    {
      id: 'classique',
      titleFr: 'Formation Classique',
      titleEn: 'Classic Training',
      subtitleFr: 'Parcours initiatique complet',
      subtitleEn: 'Complete initiatory path',
      eur: 310,
      xof: 203000,
      period: t('/mois', '/month'),
      duration: t('Durée indéterminée', 'Unlimited duration'),
      features: [
        { fr: 'Hermétisme & Kabbale égyptienne', en: 'Hermeticism & Egyptian Kabbalah' },
        { fr: 'Magie opérative et rituelle', en: 'Operative and ritual magic' },
        { fr: 'Méditation & élévation de conscience', en: 'Meditation & consciousness elevation' },
        { fr: 'Alchimie spirituelle', en: 'Spiritual alchemy' },
        { fr: 'Astrologie sacrée', en: 'Sacred astrology' },
        { fr: 'Radiesthésie & géobiologie', en: 'Dowsing & geobiology' },
        { fr: 'Chamanisme ancestral', en: 'Ancestral shamanism' },
        { fr: '2 sessions live/mois (2h)', en: '2 live sessions/month (2h)' },
      ],
      color: 'amber',
    },
    {
      id: 'premium',
      titleFr: 'Formation Premium',
      titleEn: 'Premium Training',
      subtitleFr: 'Accompagnement intensif personnalisé',
      subtitleEn: 'Intensive personalized support',
      eur: 1600,
      xof: 1050000,
      period: t('/mois', '/month'),
      duration: t('Engagement 3 ans', '3-year commitment'),
      features: [
        { fr: 'Tout le programme Classique', en: 'Full Classic program' },
        { fr: 'Soins énergétiques ILLIMITÉS', en: 'UNLIMITED energy treatments' },
        { fr: 'Initiations spirituelles personnalisées', en: 'Personalized spiritual initiations' },
        { fr: '4 sessions live/mois (2h)', en: '4 live sessions/month (2h)' },
        { fr: 'Transmissions personnalisées', en: 'Personalized transmissions' },
        { fr: 'Accompagnement sur-mesure', en: 'Tailored support' },
        { fr: 'Accès prioritaire au Maître', en: 'Priority access to the Master' },
        { fr: 'Harmonisation corps subtils', en: 'Subtle bodies harmonization' },
      ],
      color: 'gold',
      isPremium: true,
    },
  ];

  const topics = [
    { icon: '☿', label: t('Hermétisme', 'Hermeticism') },
    { icon: '✡', label: t('Kabbale', 'Kabbalah') },
    { icon: '🔮', label: t('Magie', 'Magic') },
    { icon: '🧘', label: t('Méditation', 'Meditation') },
    { icon: '⚗️', label: t('Alchimie', 'Alchemy') },
    { icon: '✨', label: t('Astrologie', 'Astrology') },
    { icon: '🔱', label: t('Chamanisme', 'Shamanism') },
  ];

  return (
    <section id="formations" className="relative py-24 bg-gradient-to-b from-black via-stone-950 to-black overflow-hidden">
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="flowerOfLife" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="26" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <circle cx="15" cy="26" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <circle cx="45" cy="26" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <circle cx="22.5" cy="13" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <circle cx="37.5" cy="13" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <circle cx="22.5" cy="39" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <circle cx="37.5" cy="39" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flowerOfLife)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-xs tracking-[0.3em] text-amber-500 border border-amber-600/30 rounded-full">
            {t('FORMATIONS', 'TRAINING PROGRAMS')}
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
            {t("L'Hermétisme Vivant", "Living Hermeticism")}
          </h2>
          <p className="max-w-3xl mx-auto text-gray-400 mb-8">
            {t(
              "Héritier de la sagesse de l'Égypte antique et du dieu-prophète Hermès Trismégiste, ce parcours initiatique vous guide vers la connaissance céleste et la réalisation spirituelle.",
              "Heir to the wisdom of ancient Egypt and the god-prophet Hermes Trismegistus, this initiatory path guides you toward celestial knowledge and spiritual realization."
            )}
          </p>

          {/* Topics Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {topics.map((topic, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-amber-900/20 border border-amber-700/30 rounded-full text-sm text-amber-400 hover:bg-amber-800/30 transition-colors cursor-default"
              >
                <span className="mr-2">{topic.icon}</span>
                {topic.label}
              </span>
            ))}
          </div>

          {/* Currency Toggle */}
          <button
            onClick={() => setShowXof(!showXof)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/20 border border-amber-600/30 rounded-full text-sm text-amber-400 hover:bg-amber-900/30 transition-colors"
          >
            <span className={!showXof ? 'font-bold' : 'opacity-60'}>EUR</span>
            <div className="w-8 h-4 bg-black/50 rounded-full relative">
              <div className={`absolute top-0.5 w-3 h-3 bg-amber-500 rounded-full transition-all ${showXof ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className={showXof ? 'font-bold' : 'opacity-60'}>XOF</span>
          </button>
        </div>

        {/* Formations Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {formations.map((formation) => (
            <div
              key={formation.id}
              className={`relative group rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                formation.isPremium
                  ? 'bg-gradient-to-br from-amber-900/30 via-black to-red-950/20'
                  : 'bg-gradient-to-br from-stone-900/50 to-black'
              }`}
            >
              {/* Premium Glow */}
              {formation.isPremium && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-red-500/10 animate-pulse" />
              )}

              {/* Border */}
              <div className={`absolute inset-0 rounded-3xl border-2 ${
                formation.isPremium ? 'border-amber-500/50' : 'border-amber-900/30'
              } group-hover:border-amber-500/70 transition-colors`} />

              {/* Premium Badge */}
              {formation.isPremium && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-gradient-to-r from-amber-500 to-red-600 text-black text-xs font-bold tracking-wider rounded-bl-2xl">
                  PREMIUM
                </div>
              )}

              <div className="relative p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-medium text-white mb-2">
                    {t(formation.titleFr, formation.titleEn)}
                  </h3>
                  <p className="text-amber-500/80 text-sm">
                    {t(formation.subtitleFr, formation.subtitleEn)}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-amber-900/30">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-light ${formation.isPremium ? 'text-amber-400' : 'text-white'}`}>
                      {formatPrice(formation.eur, formation.xof)}
                    </span>
                    <span className="text-gray-500">{formation.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{formation.duration}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {formation.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${formation.isPremium ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{t(feature.fr, feature.en)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="https://wa.me/22890000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 w-full py-4 rounded-full font-medium transition-all duration-300 ${
                    formation.isPremium
                      ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 text-black hover:shadow-lg hover:shadow-amber-500/30 hover:scale-[1.02]'
                      : 'bg-amber-900/30 text-amber-400 border border-amber-700/50 hover:bg-amber-800/40'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t("Rejoindre la formation", "Join the training")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FormationsSection;