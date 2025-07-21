import React, { useState, useEffect } from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import {
    ShopOutlined,
    TeamOutlined,
    SafetyCertificateOutlined,
    StarFilled,
    ArrowRightOutlined,
    CloseOutlined,
    CheckCircleOutlined,
    GlobalOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface PromotionalModalProps {
    onClose?: () => void;
}

const ProfessionalPromoModal: React.FC<PromotionalModalProps> = ({ onClose }) => {
    const [visible, setVisible] = useState(false);
    
    // Navigation simulée
    const navigate = (path: string) => {
        console.log(`Navigation vers: ${path}`);
    };

    // Vérifier si l'utilisateur a déjà vu le modal aujourd'hui
    useEffect(() => {
        const lastShown = localStorage.getItem('promotional_modal_last_shown');
        const today = new Date().toDateString();
        const userEmail = localStorage.getItem('userEmail');

        if (!userEmail && lastShown !== today) {
            setTimeout(() => setVisible(true), 2000);
        }
    }, []);

    // Styles CSS ultra-professionnels
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.95) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            @keyframes gentleFloat {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                }
                33% {
                    transform: translateY(-8px) rotate(120deg);
                }
                66% {
                    transform: translateY(-4px) rotate(240deg);
                }
            }

            @keyframes subtleGlow {
                0%, 100% {
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.8;
                    transform: scale(1.2);
                }
            }

            @keyframes gradientShift {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }

            .professional-promo-modal .ant-modal-content {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: modalSlideIn 0.5s ease-out;
            }

            .professional-promo-modal .ant-modal-body {
                padding: 0;
            }

            .professional-promo-modal .ant-modal-close {
                top: 24px;
                right: 24px;
                color: white;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                z-index: 10;
            }

            .professional-promo-modal .ant-modal-close:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: scale(1.05);
            }

            .promo-header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #10b981 100%);
                background-size: 200% 200%;
                animation: gradientShift 8s ease infinite;
                position: relative;
                overflow: hidden;
                padding: 48px 40px;
            }

            .light-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                opacity: 0.4;
                animation: subtleGlow 3s ease-in-out infinite;
            }

            .light-particle:nth-child(1) {
                top: 15%;
                left: 10%;
                animation-delay: 0s;
                animation-duration: 4s;
            }

            .light-particle:nth-child(2) {
                top: 25%;
                right: 15%;
                animation-delay: 1s;
                animation-duration: 3.5s;
            }

            .light-particle:nth-child(3) {
                top: 60%;
                left: 20%;
                animation-delay: 2s;
                animation-duration: 4.5s;
            }

            .light-particle:nth-child(4) {
                bottom: 20%;
                right: 25%;
                animation-delay: 0.5s;
                animation-duration: 3s;
            }

            .light-particle:nth-child(5) {
                top: 40%;
                left: 70%;
                animation-delay: 1.5s;
                animation-duration: 5s;
            }

            .light-particle:nth-child(6) {
                bottom: 35%;
                left: 15%;
                animation-delay: 2.5s;
                animation-duration: 3.8s;
            }

            .light-particle:nth-child(7) {
                top: 70%;
                right: 40%;
                animation-delay: 0.8s;
                animation-duration: 4.2s;
            }

            .light-particle:nth-child(8) {
                top: 30%;
                left: 50%;
                animation-delay: 1.8s;
                animation-duration: 3.3s;
            }

            .floating-element {
                position: absolute;
                width: 60px;
                height: 60px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 50%;
                animation: gentleFloat 8s ease-in-out infinite;
                backdrop-filter: blur(5px);
            }

            .floating-element:nth-child(1) {
                top: 10%;
                right: 10%;
                animation-delay: 0s;
            }

            .floating-element:nth-child(2) {
                bottom: 15%;
                left: 12%;
                animation-delay: 2s;
                width: 40px;
                height: 40px;
            }

            .floating-element:nth-child(3) {
                top: 50%;
                right: 8%;
                animation-delay: 4s;
                width: 30px;
                height: 30px;
            }

            .promo-cta-button {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                height: 52px;
                padding: 0 32px;
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
                transition: all 0.3s ease;
                font-size: 16px;
            }

            .promo-cta-button:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                box-shadow: 0 12px 35px rgba(5, 150, 105, 0.35);
                transform: translateY(-2px);
                color: white;
            }

            .promo-secondary-button {
                background: transparent;
                border: 2px solid #e5e7eb;
                color: #6b7280;
                border-radius: 12px;
                height: 52px;
                padding: 0 24px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .promo-secondary-button:hover {
                border-color: #9ca3af;
                color: #374151;
                transform: translateY(-1px);
            }

            .feature-item {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px 0;
                border-bottom: 1px solid #f3f4f6;
                transition: all 0.3s ease;
            }

            .feature-item:last-child {
                border-bottom: none;
            }

            .feature-item:hover {
                background: #f8fafc;
                padding-left: 8px;
                border-radius: 8px;
            }

            .feature-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                color: #0ea5e9;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 24px;
                margin: 32px 0;
            }

            .stat-item {
                text-align: center;
                padding: 24px 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            }

            .stat-item:hover {
                transform: translateY(-4px);
                background: rgba(255, 255, 255, 0.15);
            }

            .stat-number {
                font-size: 28px;
                font-weight: 700;
                color: white;
                margin-bottom: 8px;
                display: block;
            }

            .stat-label {
                font-size: 14px;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
            }

            .premium-badge {
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                color: #92400e;
                padding: 8px 16px;
                border-radius: 24px;
                font-size: 13px;
                font-weight: 600;
                border: none;
                box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
            }

            .content-section {
                padding: 48px 40px;
                background: #fafbfc;
            }

            .trust-indicators {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 32px;
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #e5e7eb;
            }

            .trust-item {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #6b7280;
                font-size: 14px;
                font-weight: 500;
            }

            @media (max-width: 768px) {
                .promo-header {
                    padding: 32px 24px;
                }

                .content-section {
                    padding: 32px 24px;
                }

                .stats-grid {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }

                .trust-indicators {
                    flex-direction: column;
                    gap: 16px;
                }
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

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={680}
            centered
            className="professional-promo-modal"
            maskStyle={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
            }}
            closeIcon={<CloseOutlined />}
        >
            {/* Header avec effets lumineux */}
            <div className="promo-header">
                {/* Particules lumineuses subtiles */}
                <div className="light-particle"></div>
                <div className="light-particle"></div>
                <div className="light-particle"></div>
                <div className="light-particle"></div>
                <div className="light-particle"></div>
                <div className="light-particle"></div>
                <div className="light-particle"></div>
                <div className="light-particle"></div>

                {/* Éléments flottants */}
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <img src="/images/logob.png" alt="Logo" className="w-10 h-10" />
                            </div>
                            <div>
                                <Title level={3} className="!mb-0 !text-white font-bold">
                                    Terminal d'Échanges
                                </Title>
                                <Text className="text-blue-100 text-sm">Plateforme B2B Professionnelle</Text>
                            </div>
                        </div>
                        
                        <div className="premium-badge">
                            <StarFilled className="mr-2" />
                            Nouveau
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <Title level={2} className="!text-white !mb-4 font-bold">
                            Rejoignez la révolution B2B
                        </Title>
                        <Text className="text-blue-100 text-lg block max-w-md mx-auto">
                            Connectez-vous avec des milliers de professionnels et développez votre activité
                        </Text>
                    </div>

                    {/* Statistiques */}
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">5,000+</span>
                            <span className="stat-label">Fournisseurs</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">15,000+</span>
                            <span className="stat-label">Utilisateurs</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Satisfaction</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section contenu */}
            <div className="content-section">
                {/* Fonctionnalités principales */}
                <div className="mb-8">
                    <div className="feature-item">
                        <div className="feature-icon">
                            <ShopOutlined />
                        </div>
                        <div>
                            <Text strong className="block text-gray-800 text-base">
                                Catalogue vérifié
                            </Text>
                            <Text className="text-gray-600 text-sm">
                                Accédez à des milliers de produits de qualité
                            </Text>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <TeamOutlined />
                        </div>
                        <div>
                            <Text strong className="block text-gray-800 text-base">
                                Réseau professionnel
                            </Text>
                            <Text className="text-gray-600 text-sm">
                                Connectez-vous avec des partenaires de confiance
                            </Text>
                        </div>
                    </div>

                    <div className="feature-item">
                        <div className="feature-icon">
                            <SafetyCertificateOutlined />
                        </div>
                        <div>
                            <Text strong className="block text-gray-800 text-base">
                                Transactions sécurisées
                            </Text>
                            <Text className="text-gray-600 text-sm">
                                Paiements protégés et garantie qualité
                            </Text>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="text-center">
                    <Space size="large" className="w-full justify-center">
                        <Button
                            className="promo-cta-button"
                            onClick={handleJoinNow}
                            icon={<ArrowRightOutlined />}
                        >
                            Commencer gratuitement
                        </Button>
                        
                        <Button
                            className="promo-secondary-button"
                            onClick={() => {
                                handleClose();
                                navigate('/about');
                            }}
                        >
                            En savoir plus
                        </Button>
                    </Space>

                    {/* Indicateurs de confiance */}
                    <div className="trust-indicators">
                        <div className="trust-item">
                            <CheckCircleOutlined className="text-green-500" />
                            <span>100% Gratuit</span>
                        </div>
                        <div className="trust-item">
                            <SafetyCertificateOutlined className="text-blue-500" />
                            <span>Sécurisé</span>
                        </div>
                        <div className="trust-item">
                            <GlobalOutlined className="text-purple-500" />
                            <span>Support 24h/7j</span>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProfessionalPromoModal;