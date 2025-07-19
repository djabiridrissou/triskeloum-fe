import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space, Divider } from 'antd';
import {
    ShopOutlined,
    TeamOutlined,
    TrophyOutlined,
    SafetyCertificateOutlined,
    StarFilled,
    ArrowRightOutlined,
    CloseOutlined,
    GiftOutlined,
    ThunderboltOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

interface PromotionalModalProps {
    onClose?: () => void;
}

const PromotionalModal: React.FC<PromotionalModalProps> = ({ onClose }) => {
    const [visible, setVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    // Vérifier si l'utilisateur a déjà vu le modal aujourd'hui
    useEffect(() => {
        const lastShown = localStorage.getItem('promotional_modal_last_shown');
        const today = new Date().toDateString();
        const userEmail = localStorage.getItem('userEmail');

        // Afficher le modal seulement si l'utilisateur n'est pas connecté et ne l'a pas vu aujourd'hui
        if (!userEmail && lastShown !== today) {
            setTimeout(() => setVisible(true), 1500); // Délai de 1.5s après le chargement
        }
    }, []);

    // Rotation automatique des slides
    useEffect(() => {
        if (!visible) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 4000);

        return () => clearInterval(interval);
    }, [visible]);

    // Styles CSS avancés
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes slideInFromRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideInFromLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
                }
                50% {
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
                }
            }

            @keyframes floatAnimation {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            @keyframes sparkle {
                0%, 100% {
                    opacity: 0;
                    transform: scale(0);
                }
                50% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .promotional-modal .ant-modal-content {
                background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: modalSlideIn 0.6s ease-out;
            }

            .promotional-modal .ant-modal-header {
                background: linear-gradient(135deg, #1e40af 0%, #10b981 100%);
                border-bottom: none;
                padding: 0;
            }

            .promotional-modal .ant-modal-body {
                padding: 0;
            }

            .promotional-modal .ant-modal-close {
                top: 20px;
                right: 20px;
                color: white;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            .promotional-modal .ant-modal-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .promo-gradient-bg {
                background: linear-gradient(135deg, #1e40af 0%, #10b981 100%);
                position: relative;
                overflow: hidden;
            }

            .promo-gradient-bg::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                animation: floatAnimation 6s ease-in-out infinite;
            }

            .promo-cta-button {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: none;
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
                transition: all 0.3s ease;
                animation: pulseGlow 3s infinite;
                color: white;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .promo-cta-button:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                box-shadow: 0 12px 35px rgba(5, 150, 105, 0.5);
                transform: translateY(-2px);
                color: white;
            }

            .promo-secondary-button {
                background: transparent;
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }

            .promo-secondary-button:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.5);
                color: white;
                transform: translateY(-1px);
            }

            .feature-card {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                background: rgba(255, 255, 255, 0.95);
            }

            .feature-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                transition: left 0.5s;
            }

            .feature-card:hover::before {
                left: 100%;
            }

            .slide-in-right {
                animation: slideInFromRight 0.6s ease-out;
            }

            .slide-in-left {
                animation: slideInFromLeft 0.6s ease-out;
            }

            .sparkle-effect {
                position: absolute;
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
                animation: sparkle 2s infinite;
            }

            .stats-counter {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .slide-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .slide-indicator.active {
                background: white;
                transform: scale(1.2);
            }

            .promotional-badge {
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                color: #92400e;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                border: none;
                animation: pulseGlow 2s infinite;
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem('promotional_modal_last_shown', new Date().toDateString());
        onClose?.();
    };

    const handleJoinNow = () => {
        handleClose();
        navigate('/login');
    };

    const slides = [
        {
            title: "Rejoignez la Première Plateforme B2B du Togo",
            subtitle: "Connectez-vous avec des milliers de fournisseurs et acheteurs professionnels",
            features: [
                { icon: ShopOutlined, text: "Plus de 5,000 fournisseurs vérifiés", color: "#10b981" },
                { icon: TeamOutlined, text: "Réseau de 15,000+ professionnels", color: "#3b82f6" },
                { icon: SafetyCertificateOutlined, text: "Transactions 100% sécurisées", color: "#f59e0b" }
            ]
        },
        {
            title: "Développez Votre Business Facilement",
            subtitle: "Outils professionnels pour maximiser vos ventes et votre visibilité",
            features: [
                { icon: TrophyOutlined, text: "Augmentez vos ventes de 300%", color: "#ef4444" },
                { icon: GlobalOutlined, text: "Portée nationale et internationale", color: "#8b5cf6" },
                { icon: ThunderboltOutlined, text: "Commandes instantanées 24h/7j", color: "#f97316" }
            ]
        },
        {
            title: "Offre Spéciale de Lancement",
            subtitle: "Profitez de 3 mois gratuits pour tous les nouveaux membres",
            features: [
                { icon: GiftOutlined, text: "3 mois d'abonnement Premium offerts", color: "#ec4899" },
                { icon: StarFilled, text: "Support client dédié prioritaire", color: "#fbbf24" },
                { icon: SafetyCertificateOutlined, text: "Certification gratuite incluse", color: "#10b981" }
            ]
        }
    ];

    const currentSlideData = slides[currentSlide];

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={900}
            centered
            className="promotional-modal"
            maskStyle={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
            }}
            closeIcon={<CloseOutlined />}
        >
            {/* En-tête avec dégradé */}
            <div className="promo-gradient-bg text-white relative">
                {/* Effets de particules */}
                <div className="sparkle-effect" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
                <div className="sparkle-effect" style={{ top: '60%', left: '80%', animationDelay: '1s' }} />
                <div className="sparkle-effect" style={{ top: '30%', left: '70%', animationDelay: '2s' }} />
                
                <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <img src="/images/logob.png" alt="Logo" className="w-12 h-12" />
                            </div>
                            <div>
                                <Title level={3} className="!mb-0 !text-white">
                                    Terminal d'Échanges
                                </Title>
                                <Text className="text-blue-100">Plateforme B2B #1 en Côte d'Ivoire</Text>
                            </div>
                        </div>
                        
                        <div className="promotional-badge px-4 py-2 rounded-full text-sm font-bold">
                            <GiftOutlined className="mr-2" />
                            OFFRE LIMITÉE
                        </div>
                    </div>

                    {/* Contenu dynamique des slides */}
                    <div className="mb-8">
                        <Title level={2} className="!text-white !mb-4 slide-in-left">
                            {currentSlideData.title}
                        </Title>
                        <Paragraph className="text-blue-100 text-lg mb-6 slide-in-right">
                            {currentSlideData.subtitle}
                        </Paragraph>

                        {/* Statistiques impressionnantes */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { number: "5,000+", label: "Fournisseurs" },
                                { number: "15,000+", label: "Utilisateurs" },
                                { number: "98%", label: "Satisfaction" }
                            ].map((stat, index) => (
                                <div key={index} className="stats-counter p-4 text-center">
                                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                                    <div className="text-blue-100 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Indicateurs de slides */}
                    <div className="flex justify-center space-x-2 mb-6">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Corps du modal */}
            <div className="p-8">
                {/* Fonctionnalités principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {currentSlideData.features.map((feature, index) => (
                        <div key={index} className="feature-card p-6 text-center">
                            <div 
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                style={{ background: `${feature.color}20`, color: feature.color }}
                            >
                                <feature.icon className="text-2xl" />
                            </div>
                            <Text strong className="block text-gray-800">
                                {feature.text}
                            </Text>
                        </div>
                    ))}
                </div>

                <Divider />

                {/* Section d'action */}
                <div className="text-center space-y-6">
                    <div>
                        <Title level={3} className="!mb-2 text-gray-800">
                            Prêt à Transformer Votre Business ?
                        </Title>
                        <Text className="text-gray-600 text-lg">
                            Rejoignez des milliers d'entreprises qui font déjà confiance à Terminal d'Échanges
                        </Text>
                    </div>

                    {/* Boutons d'action */}
                    <Space size="large" className="w-full justify-center flex-wrap">
                        <Button
                            type="primary"
                            size="large"
                            className="promo-cta-button h-14 px-8"
                            onClick={handleJoinNow}
                            icon={<ArrowRightOutlined />}
                        >
                            Commencer Maintenant - C'est Gratuit
                        </Button>
                        
                        <Button
                            size="large"
                            className="h-14 px-6"
                            onClick={() => {
                                handleClose();
                                navigate('/about');
                            }}
                        >
                            En Savoir Plus
                        </Button>
                    </Space>

                    {/* Garanties et certifications */}
                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 mt-6">
                        <div className="flex items-center space-x-2">
                            <SafetyCertificateOutlined className="text-green-500" />
                            <span>100% Sécurisé</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <StarFilled className="text-yellow-500" />
                            <span>Support 24h/7j</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <GiftOutlined className="text-blue-500" />
                            <span>Sans Engagement</span>
                        </div>
                    </div>

                    {/* Note de confidentialité */}
                    <Text className="text-xs text-gray-400 block mt-4">
                        En rejoignant Terminal d'Échanges, vous acceptez nos conditions d'utilisation. 
                        Aucune carte de crédit requise pour commencer.
                    </Text>
                </div>
            </div>
        </Modal>
    );
};

// Hook personnalisé pour gérer le modal promotionnel
export const usePromotionalModal = () => {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        const checkShouldShow = () => {
            const lastShown = localStorage.getItem('promotional_modal_last_shown');
            const today = new Date().toDateString();
            const userEmail = localStorage.getItem('userEmail');
            const hasSeenModal = localStorage.getItem('promotional_modal_dismissed');

            // Afficher le modal si :
            // - L'utilisateur n'est pas connecté
            // - Il ne l'a pas vu aujourd'hui
            // - Il ne l'a jamais définitivement fermé
            if (!userEmail && lastShown !== today && !hasSeenModal) {
                setShouldShow(true);
            }
        };

        // Vérifier après un court délai pour s'assurer que le localStorage est bien chargé
        const timer = setTimeout(checkShouldShow, 1000);
        return () => clearTimeout(timer);
    }, []);

    const hideModal = () => {
        setShouldShow(false);
        localStorage.setItem('promotional_modal_last_shown', new Date().toDateString());
    };

    const dismissModal = () => {
        setShouldShow(false);
        localStorage.setItem('promotional_modal_dismissed', 'true');
    };

    return { shouldShow, hideModal, dismissModal };
};

export default PromotionalModal;