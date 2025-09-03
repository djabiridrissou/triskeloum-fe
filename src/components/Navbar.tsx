import React, { useState, useEffect, useMemo, useContext } from 'react';
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
import { useCartContext } from '../contexts/CartContext';

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
    const navigate = useNavigate();
    const { cartItems, getTotalItems, isLoading, loadCartFromAPI, getTotalPrice } = useCartContext();


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
                min-width: 200px;
            }

            .dropdown-menu .ant-dropdown-menu-item {
                border-radius: 12px;
                margin: 2px 0;
                padding: 12px 16px;
                transition: all 0.2s ease;
            }

            .dropdown-menu .ant-dropdown-menu-item:hover {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            }

            .dropdown-menu .ant-dropdown-menu-item-danger:hover {
                background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
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

    // Fonction pour obtenir l'URL du tableau de bord selon le rôle
    const getDashboardUrl = (role: string) => {
        switch (role) {
            case 'buyer':
                return '/buyer/home';
            case 'supplier':
                return '/supplier/catalogue';
            case 'admin':
                return '/admin/home';
            default:
                return '/dashboard';
        }
    };

    const getUserMenuItems = (): MenuProps['items'] => {
        if (!user) return [];

        return [
            {
                key: 'dashboard',
                label: (
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <DashboardOutlined className="text-blue-600" />
                        </div>
                        <span className="font-medium">Tableau de bord</span>
                    </div>
                ),
                onClick: () => handleNavigation(getDashboardUrl(user.role)),
            },
            { type: 'divider' },
            {
                key: 'logout',
                label: (
                    <div className="flex items-center space-x-3 text-red-600">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <LogoutOutlined className="text-red-600" />
                        </div>
                        <span className="font-medium">Déconnexion</span>
                    </div>
                ),
                onClick: handleLogout,
                danger: true,
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
                        {/* Panier */}
                        <Tooltip title="Panier d'achat" placement="bottom">
                            <Badge count={getTotalItems()} className="cart-badge">
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
                title={
                    <div className="flex items-center justify-between">
                        <span>Panier ({getTotalItems()})</span>
                        <Button
                            size="small"
                            onClick={loadCartFromAPI}
                            loading={isLoading}
                            title="Synchroniser avec le serveur"
                        >
                            🔄
                        </Button>
                    </div>
                }
                placement="right"
                onClose={() => setCartDrawerOpen(false)}
                open={cartDrawerOpen}
                width={400}
            >
                {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                        <Empty description="Panier vide" />
                        <Button
                            type="link"
                            onClick={loadCartFromAPI}
                            loading={isLoading}
                        >
                            Vérifier sur le serveur
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                {item.image && (
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL}/${item.image}`}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{item.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {item.price} × {item.quantity}
                                    </div>
                                </div>
                                <div className="font-semibold text-sm">
                                    {(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}

                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center font-bold text-lg mb-4">
                                <span>Total:</span>
                                <span>{getTotalPrice().toFixed(2)}</span>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => {
                                    setCartDrawerOpen(false);
                                    navigate('/buyer/checkout');
                                }}
                            >
                                Commander ({getTotalItems()})
                            </Button>
                        </div>
                    </div>
                )}
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
                        Acheteurs
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