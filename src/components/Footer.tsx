import { useLanguage } from "../contexts/LanguageContext";

const Footer = () => {
    const { lang, t } = useLanguage();

    const links = {
        services: [
            { fr: 'Consultation', en: 'Consultation', href: '#services' },
            { fr: "Lecture de l'Âme", en: 'Soul Reading', href: '#services' },
            { fr: 'Bilan Énergétique', en: 'Energy Assessment', href: '#services' },
            { fr: 'Livre de Vie', en: 'Book of Life', href: '#services' },
        ],
        formations: [
            { fr: 'Formation Classique', en: 'Classic Training', href: '#formations' },
            { fr: 'Formation Premium', en: 'Premium Training', href: '#formations' },
            { fr: 'BioGéométrie', en: 'BioGeometry', href: '#biogeometry' },
        ],
        about: [
            { fr: 'Le Maître', en: 'The Master', href: '#about' },
            { fr: 'Notre Équipe', en: 'Our Team', href: '#about' },
            { fr: 'Akpé Fondation', en: 'Akpé Foundation', href: '#' },
        ],
    };

    return (
        <footer className="relative bg-black border-t border-amber-900/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            {/* Logo */}
                            <svg viewBox="0 0 50 50" className="w-10 h-10">
                                <defs>
                                    <linearGradient id="footerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#D4AF37" />
                                        <stop offset="100%" stopColor="#B8860B" />
                                    </linearGradient>
                                </defs>
                                <circle cx="25" cy="25" r="23" fill="none" stroke="url(#footerGold)" strokeWidth="1.5" />
                                {[0, 90, 180, 270].map((r, i) => (
                                    <path key={i} d="M25 25 Q25 18 20 15 Q14 12 13 17 Q12 23 20 25" fill="none" stroke="url(#footerGold)" strokeWidth="1.5" transform={`rotate(${r} 25 25)`} />
                                ))}
                            </svg>
                            <span className="text-xl font-light tracking-[0.2em] text-amber-400">TRISKELOUM</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
                            {t(
                                "Cabinet digital de développement spirituel. Guérir les maux de l'âme et accompagner chacun dans un voyage profond de connaissance de soi.",
                                "Digital spiritual development practice. Healing the wounds of the soul and guiding each person on a deep journey of self-discovery."
                            )}
                        </p>
                        <div className="flex gap-4">
                            {/* Social placeholder icons */}
                            {['instagram', 'facebook', 'youtube'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-full bg-amber-900/20 border border-amber-700/30 flex items-center justify-center text-amber-500 hover:bg-amber-800/30 hover:border-amber-600/50 transition-colors">
                                    <span className="text-xs uppercase">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-amber-400 font-medium mb-4">{t('Services', 'Services')}</h4>
                        <ul className="space-y-2">
                            {links.services.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                                        {t(link.fr, link.en)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Formations */}
                    <div>
                        <h4 className="text-amber-400 font-medium mb-4">{t('Formations', 'Training')}</h4>
                        <ul className="space-y-2">
                            {links.formations.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                                        {t(link.fr, link.en)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h4 className="text-amber-400 font-medium mb-4">{t('À propos', 'About')}</h4>
                        <ul className="space-y-2">
                            {links.about.map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="text-gray-500 hover:text-amber-400 text-sm transition-colors">
                                        {t(link.fr, link.en)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-amber-900/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} Triskeloum. {t('Tous droits réservés.', 'All rights reserved.')}
                    </p>
                    <p className="text-gray-600 text-sm italic">
                        "{t("L'éveil spirituel est un briseur d'illusions", "Spiritual awakening is a breaker of illusions")}"
                    </p>
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-amber-900/20" />
            <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-amber-900/20" />
        </footer>
    );
};

export default Footer;