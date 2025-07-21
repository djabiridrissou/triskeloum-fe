import React, { useState, useEffect, useMemo } from 'react';
import {
    ShoppingCartOutlined,
    ShopOutlined,
    TeamOutlined,
    FileTextOutlined,
    UserOutlined,
    LogoutOutlined,
    DeleteOutlined,
    PlusOutlined,
    MinusOutlined,
    BellOutlined,
    SearchOutlined,
    MenuOutlined,
    CloseOutlined,
    DashboardOutlined,
    SettingOutlined,
    HeartOutlined,
    StarFilled,
    SafetyCertificateOutlined,
    GlobalOutlined,
    PhoneOutlined,
    MailOutlined,
    DownOutlined,
    CheckCircleOutlined,
    CrownOutlined,
} from '@ant-design/icons';
import {
    Badge,
    Drawer,
    Button,
    Avatar,
    Dropdown,
    Empty,
    InputNumber,
    Input,
    Tooltip,
    Divider,
    Tag,
    Rate,
    Progress,
    Space,
    Typography,
    notification
} from 'antd';
// Navigation simulée

import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

interface User {
    id: string;
    name: string;
    raisonSociale: string;
    role: 'buyer' | 'supplier' | 'admin';
    email: string;
    picture?: string;
    verified?: boolean;
    rating?: number;
    completionLevel?: number;
    isPremium?: boolean;
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [notifications, setNotifications] = useState(3);
    const [cartItems] = useState([]);
    const navigate = useNavigate();

    // Styles CSS ultra-professionnels
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .professional-navbar {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                box-shadow: 0 4px 20px rgba(30, 64, 175, 0.15);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .navbar-actions {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .action-button {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: white;
                transition: all 0.3s ease;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .action-button:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .action-button:active {
                transform: translateY(0);
            }

            .action-button .anticon {
                font-size: 18px;
            }

            .user-profile-button {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 16px;
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: white;
                transition: all 0.3s ease;
                cursor: pointer;
                min-height: 56px;
            }

            .user-profile-button:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .user-avatar {
                position: relative;
            }

            .user-avatar::after {
                content: '';
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 12px;
                height: 12px;
                background: #10b981;
                border: 2px solid white;
                border-radius: 50%;
            }

            .user-info {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                min-width: 0;
            }

            .user-name {
                font-weight: 600;
                font-size: 14px;
                line-height: 1.2;
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .user-role {
                font-size: 12px;
                opacity: 0.8;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .login-button {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                height: 44px;
                padding: 0 24px;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                transition: all 0.3s ease;
            }

            .login-button:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
                transform: translateY(-1px);
                color: white;
            }

            .mobile-toggle {
                width: 44px;
                height: 44px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .mobile-toggle:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
                color: white;
            }

            .notification-badge .ant-badge-count {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
                animation: pulse 2s infinite;
            }

            .cart-badge .ant-badge-count {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .dropdown-menu .ant-dropdown-menu {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.05);
                padding: 8px;
                min-width: 280px;
            }

            .dropdown-menu .ant-dropdown-menu-item {
                border-radius: 12px;
                margin: 2px 0;
                padding: 16px;
                transition: all 0.2s ease;
            }

            .dropdown-menu .ant-dropdown-menu-item:hover {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            }

            .user-header {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                margin: -8px -8px 16px -8px;
            }

            .premium-tag {
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                color: #92400e;
                border: none;
                font-weight: 600;
            }

            .verified-tag {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
            }

            @media (max-width: 768px) {
                .navbar-actions {
                    gap: 6px;
                }
                
                .action-button {
                    width: 40px;
                    height: 40px;
                }
                
                .action-button .anticon {
                    font-size: 16px;
                }
                
                .user-profile-button {
                    padding: 6px 12px;
                    min-height: 48px;
                }
                
                .user-info {
                    display: none;
                }
            }

            @media (max-width: 640px) {
                .navbar-actions .action-button:not(:last-child) {
                    display: none;
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

    // Simulation des données utilisateur
    useEffect(() => {
        const checkAuthStatus = () => {
            const userEmail = localStorage.getItem('userEmail');
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName');
            const userRole = localStorage.getItem('userRole');

            if (userEmail && userId && userName && userRole) {
                setUser({
                    id: userId,
                    name: userName,
                    raisonSociale: userName,
                    role: userRole as 'buyer' | 'supplier' | 'admin',
                    email: userEmail,
                    verified: true,
                    rating: 4.8,
                    completionLevel: 85,
                    isPremium: userRole === 'supplier',
                });
            } else {
                setUser(null);
            }
        };

        checkAuthStatus();
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogout = () => {
        notification.success({
            message: 'Déconnexion réussie',
            description: 'À bientôt sur Terminal d\'Échanges !',
            placement: 'topRight',
        });

        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    // Menu utilisateur ultra-professionnel
    const getUserMenuItems = (): MenuProps['items'] => {
        if (!user) return [];

        const userHeader = {
            key: 'header',
            label: (
                <div className="user-header">
                    <div className="flex items-center space-x-3 mb-3">
                        <Avatar
                            size={48}
                            src={user.picture}
                            icon={<UserOutlined />}
                            className="border-2 border-white"
                        />
                        <div className="flex-1">
                            <div className="font-semibold text-lg">{user.name}</div>
                            <div className="text-sm opacity-90">{user.email}</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {user.verified && (
                                <Tag className="verified-tag">
                                    <CheckCircleOutlined className="mr-1" />
                                    Vérifié
                                </Tag>
                            )}
                            {user.isPremium && (
                                <Tag className="premium-tag">
                                    <CrownOutlined className="mr-1" />
                                    Premium
                                </Tag>
                            )}
                        </div>
                        {user.rating && (
                            <div className="flex items-center space-x-1">
                                <StarFilled className="text-yellow-300" />
                                <span className="text-sm">{user.rating}</span>
                            </div>
                        )}
                    </div>
                </div>
            ),
            disabled: true,
        };

        const commonItems = [
            {
                key: 'profile',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UserOutlined className="text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium">Mon profil</div>
                            <div className="text-xs text-gray-500">Gérer mes informations</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/profile'),
            },
        ];

        const roleSpecificItems = user.role === 'buyer' ? [
            {
                key: 'orders',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <FileTextOutlined className="text-green-600" />
                        </div>
                        <div>
                            <div className="font-medium">Mes commandes</div>
                            <div className="text-xs text-gray-500">Historique et suivi</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/orders'),
            },
            {
                key: 'wishlist',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <HeartOutlined className="text-red-500" />
                        </div>
                        <div>
                            <div className="font-medium">Liste de souhaits</div>
                            <div className="text-xs text-gray-500">Produits favoris</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/wishlist'),
            },
        ] : [
            {
                key: 'dashboard',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <DashboardOutlined className="text-green-600" />
                        </div>
                        <div>
                            <div className="font-medium">Tableau de bord</div>
                            <div className="text-xs text-gray-500">Vue d'ensemble</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/supplier/dashboard'),
            },
            {
                key: 'products',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <ShopOutlined className="text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium">Mes produits</div>
                            <div className="text-xs text-gray-500">Gestion du catalogue</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/supplier/products'),
            },
        ];

        return [
            userHeader,
            { type: 'divider' },
            ...commonItems,
            ...roleSpecificItems,
            {
                key: 'settings',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                            <SettingOutlined className="text-gray-600" />
                        </div>
                        <div>
                            <div className="font-medium">Paramètres</div>
                            <div className="text-xs text-gray-500">Préférences du compte</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/settings'),
            },
            { type: 'divider' },
            {
                key: 'support',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <PhoneOutlined className="text-green-600" />
                        </div>
                        <div>
                            <div className="font-medium">Support client</div>
                            <div className="text-xs text-gray-500">Aide et assistance</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/support'),
            },
            {
                key: 'logout',
                label: (
                    <div className="flex items-center space-x-3 text-red-600">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <LogoutOutlined className="text-red-600" />
                        </div>
                        <div>
                            <div className="font-medium">Déconnexion</div>
                            <div className="text-xs opacity-75">Fermer la session</div>
                        </div>
                    </div>
                ),
                onClick: handleLogout,
            },
        ];
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'buyer': return 'Acheteur';
            case 'supplier': return 'Fournisseur';
            case 'admin': return 'Administrateur';
            default: return 'Utilisateur';
        }
    };

    return (
        <nav className="professional-navbar sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div
                        onClick={() => handleNavigation('/')}
                        className="cursor-pointer flex items-center space-x-4 hover:opacity-90 transition-opacity"
                    >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <img src="/images/logob.png" alt="Logo" className="w-8 h-8" />
                        </div>
                        <div className="hidden lg:block text-white">
                            <Title level={3} className="!mb-0 !text-white font-bold">
                                Terminal d'Échanges
                            </Title>
                            <Text className="!text-white text-sm">Plateforme B2B Professionnelle</Text>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <Input.Search
                            placeholder="Rechercher des produits, fournisseurs..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            size="large"
                            className="rounded-xl"
                            style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                        />
                    </div>

                    {/* Actions de droite - VERSION PROFESSIONNELLE */}
                    <div className="navbar-actions">
                        {/* Bouton de recherche mobile */}
                       {/*  <div className="md:hidden action-button">
                            <SearchOutlined />
                        </div>

                      
                        <Tooltip title="Notifications" placement="bottom">
                            <Badge count={notifications} className="notification-badge">
                                <div 
                                    className="action-button"
                                    onClick={() => setNotificationDrawerOpen(true)}
                                >
                                    <BellOutlined />
                                </div>
                            </Badge>
                        </Tooltip> */}

                        {/* Panier */}
                        <Tooltip title="Panier d'achat" placement="bottom">
                            <Badge count={cartItems.length} className="cart-badge">
                                <div 
                                    className="action-button"
                                    onClick={() => setCartDrawerOpen(true)}
                                >
                                    <ShoppingCartOutlined />
                                </div>
                            </Badge>
                        </Tooltip>

                        {/* Profil utilisateur ou bouton de connexion */}
                        {user ? (
                            <Dropdown
                                menu={{ items: getUserMenuItems() }}
                                placement="bottomRight"
                                trigger={['click']}
                                className="dropdown-menu"
                            >
                                <div className="user-profile-button">
                                    <div className="user-avatar">
                                        <Avatar
                                            size={40}
                                            src={user.picture}
                                            icon={<UserOutlined />}
                                            className="border-2 border-white/20"
                                        />
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{user.name}</div>
                                        <div className="user-role">
                                            {getRoleDisplayName(user.role)}
                                            {user.verified && (
                                                <SafetyCertificateOutlined className="text-green-300" />
                                            )}
                                        </div>
                                    </div>
                                    <DownOutlined className="text-xs opacity-60" />
                                </div>
                            </Dropdown>
                        ) : (
                            <Button
                                className="login-button"
                                onClick={() => handleNavigation('/login')}
                            >
                                Connexion
                            </Button>
                        )}

                        {/* Menu mobile */}
                        <div 
                            className="mobile-toggle md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drawers pour le panier et les notifications */}
            <Drawer
                title="Panier d'achat"
                placement="right"
                onClose={() => setCartDrawerOpen(false)}
                open={cartDrawerOpen}
                width={400}
            >
                <Empty description="Votre panier est vide" />
            </Drawer>

            <Drawer
                title="Notifications"
                placement="right"
                onClose={() => setNotificationDrawerOpen(false)}
                open={notificationDrawerOpen}
                width={350}
            >
                <Empty description="Aucune notification" />
            </Drawer>

            {/* Menu mobile */}
            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={300}
            >
                <div className="space-y-4">
                    <Button block size="large" onClick={() => handleNavigation('/fournisseurs')}>
                        Fournisseurs
                    </Button>
                    <Button block size="large" onClick={() => handleNavigation('/revendeurs')}>
                        Revendeurs
                    </Button>
                    <Button block size="large" onClick={() => handleNavigation('/stock')}>
                        Stock
                    </Button>
                    <Button block size="large" onClick={() => handleNavigation('/about')}>
                        À propos
                    </Button>
                </div>
            </Drawer>
        </nav>
    );
};

export default Navbar;