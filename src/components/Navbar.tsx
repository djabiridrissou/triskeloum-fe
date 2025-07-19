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
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
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
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [notifications, setNotifications] = useState(3);
    const navigate = useNavigate();

    // Use the cart context
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isLoading
    } = useCartContext();

    // Mémoriser les valeurs pour éviter les recalculs inutiles
    const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);
    const totalPrice = useMemo(() => getTotalPrice(), [getTotalPrice]);

    // Styles CSS avancés
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            @keyframes shimmer {
                0% {
                    background-position: -200px 0;
                }
                100% {
                    background-position: calc(200px + 100%) 0;
                }
            }

            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }

            .navbar-gradient {
                background: linear-gradient(135deg, #1e40af 0%, #10b981 100%);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            }

            .glass-effect {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .cart-item-hover {
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .cart-item-hover:hover {
                border-color: #10b981;
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.15);
                transform: translateY(-2px);
            }

            .professional-button {
                background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
                border: none;
                box-shadow: 0 4px 15px rgba(29, 78, 216, 0.3);
                transition: all 0.3s ease;
                color: white;
            }

            .professional-button:hover {
                background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
                transform: translateY(-1px);
                color: white;
            }

            .success-button {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border: none;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                color: white;
            }

            .success-button:hover {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
                color: white;
            }

            .premium-badge {
                background: linear-gradient(45deg, #ffd700, #ffed4e);
                color: #92400e;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                border: none;
            }

            .verified-badge {
                background: linear-gradient(45deg, #10b981, #34d399);
                color: white;
                border: none;
            }

            .loading-shimmer {
                background: linear-gradient(
                    90deg,
                    #f0f0f0 25%,
                    #e0e0e0 50%,
                    #f0f0f0 75%
                );
                background-size: 200px 100%;
                animation: shimmer 1.5s infinite;
            }

            .notification-dot {
                animation: pulse 2s infinite;
            }

            .slide-down {
                animation: slideDown 0.3s ease-out;
            }

            .search-input {
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 12px;
                transition: all 0.3s ease;
            }

            .search-input:focus {
                border-color: #10b981;
                box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            }

            .animate-marquee {
                animation: marquee 60s linear infinite;
            }

            .mobile-menu-overlay {
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            }

            .user-dropdown .ant-dropdown-menu {
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.05);
                padding: 8px;
            }

            .user-dropdown .ant-dropdown-menu-item {
                border-radius: 8px;
                margin: 2px 0;
                padding: 12px;
            }

            .professional-drawer .ant-drawer-header {
                background: linear-gradient(135deg, #1e40af 0%, #10b981 100%);
                border-bottom: none;
            }

            .professional-drawer .ant-drawer-header .ant-drawer-title {
                color: white;
            }

            .professional-mobile-drawer .ant-drawer-body {
                padding: 0;
            }

            @media (max-width: 768px) {
                .navbar-gradient {
                    padding: 0.75rem 1rem;
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

    // Vérifier l'état de connexion avec données enrichies
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
                });
            } else {
                setUser(null);
            }
        };

        checkAuthStatus();

        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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

        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('cart');
        setUser(null);
        clearCart();
        navigate('/login');
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
        updateQuantity(itemId, newQuantity);
    };

    const handleItemRemove = (itemId: string) => {
        removeFromCart(itemId);
        notification.success({
            message: 'Produit retiré',
            description: 'L\'article a été retiré de votre panier',
            placement: 'topRight',
        });
    };

    const handleSearch = (value: string) => {
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value.trim())}`);
            setSearchValue('');
        }
    };

    // Menu utilisateur enrichi
    const getUserMenuItems = (): MenuProps['items'] => {
        const commonItems = [
            {
                key: 'profile',
                label: (
                    <div className="flex items-center space-x-3">
                        <UserOutlined className="text-blue-600" />
                        <div>
                            <div className="font-medium">Mon profil</div>
                            <div className="text-xs text-gray-500">Gérer mes informations</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/profile'),
            },
        ];

        const roleSpecificItems = user?.role === 'buyer' ? [
            {
                key: 'orders',
                label: (
                    <div className="flex items-center space-x-3">
                        <FileTextOutlined className="text-green-600" />
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
                        <HeartOutlined className="text-red-500" />
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
                        <DashboardOutlined className="text-green-600" />
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
                        <ShopOutlined className="text-blue-600" />
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
            ...commonItems,
            ...roleSpecificItems,
            {
                key: 'settings',
                label: (
                    <div className="flex items-center space-x-3">
                        <SettingOutlined className="text-gray-600" />
                        <div>
                            <div className="font-medium">Paramètres</div>
                            <div className="text-xs text-gray-500">Préférences</div>
                        </div>
                    </div>
                ),
                onClick: () => handleNavigation('/settings'),
            },
            {
                type: 'divider',
            },
            {
                key: 'support',
                label: (
                    <div className="flex items-center space-x-3">
                        <PhoneOutlined className="text-green-600" />
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
                        <LogoutOutlined />
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

    // Composant du panier professionnel
    const ProfessionalCartDrawer = () => (
        <Drawer
            title={
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 -m-6 p-6 mb-4">
                    <div>
                        <Title level={4} className="!mb-1 text-gray-800">
                            Panier d'achat
                        </Title>
                        <Text className="text-gray-600">
                            {totalItems} article{totalItems > 1 ? 's' : ''} • {formatPrice(totalPrice)}
                        </Text>
                    </div>
                    {cartItems.length > 0 && (
                        <Tooltip title="Vider le panier">
                            <Button
                                type="text"
                                danger
                                size="large"
                                icon={<DeleteOutlined />}
                                onClick={() => {
                                    clearCart();
                                    notification.info({
                                        message: 'Panier vidé',
                                        description: 'Tous les articles ont été retirés',
                                        placement: 'topRight',
                                    });
                                }}
                                loading={isLoading}
                                className="hover:bg-red-50"
                            />
                        </Tooltip>
                    )}
                </div>
            }
            placement="right"
            onClose={() => setCartDrawerOpen(false)}
            open={cartDrawerOpen}
            width={450}
            className="professional-drawer"
            footer={
                cartItems.length > 0 ? (
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 -m-6 p-6 space-y-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <Text strong>Sous-total:</Text>
                                <Text strong className="text-lg">{formatPrice(totalPrice)}</Text>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                <span>Frais de livraison:</span>
                                <span className="text-green-600 font-medium">Gratuit</span>
                            </div>
                            <Divider className="my-3" />
                            <div className="flex justify-between items-center">
                                <Text strong className="text-lg">Total:</Text>
                                <Text strong className="text-xl text-blue-600">
                                    {formatPrice(totalPrice)}
                                </Text>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                size="large"
                                className="flex-1 h-12 professional-button"
                                onClick={() => {
                                    setCartDrawerOpen(false);
                                    handleNavigation('/cart');
                                }}
                            >
                                Voir le panier
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                className="flex-1 h-12 success-button"
                                onClick={() => {
                                    setCartDrawerOpen(false);
                                    handleNavigation('/buyer/checkout');
                                }}
                            >
                                Commander
                            </Button>
                        </div>
                        <div className="text-center">
                            <Text className="text-xs text-gray-500 flex items-center justify-center space-x-2">
                                <SafetyCertificateOutlined />
                                <span>Paiement 100% sécurisé • Livraison rapide</span>
                            </Text>
                        </div>
                    </div>
                ) : null
            }
        >
            {cartItems.length === 0 ? (
                <div className="text-center py-16">
                    <Empty
                        description={
                            <div className="space-y-3">
                                <div className="text-gray-500">Votre panier est vide</div>
                                <Text className="text-sm text-gray-400 block">
                                    Découvrez nos produits et ajoutez vos favoris
                                </Text>
                            </div>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <Button
                        type="primary"
                        size="large"
                        className="mt-4 professional-button"
                        onClick={() => {
                            setCartDrawerOpen(false);
                            handleNavigation('/products');
                        }}
                    >
                        Découvrir les produits
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item: any, index: number) => (
                        <div
                            key={item.id}
                            className="cart-item-hover bg-white rounded-xl p-4 shadow-sm border slide-down"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <ShopOutlined className="text-2xl text-blue-400" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <Title level={5} className="!mb-1 !text-sm">
                                                {item.name}
                                            </Title>
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Text className="text-xs text-gray-500">
                                                    {item.supplierName}
                                                </Text>
                                                {item.verified && (
                                                    <Tag className="verified-badge text-xs px-1 py-0">
                                                        <SafetyCertificateOutlined className="mr-1" />
                                                        Vérifié
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                        <Tooltip title="Retirer du panier">
                                            <Button
                                                type="text"
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleItemRemove(item.id)}
                                                disabled={isLoading}
                                                loading={isLoading}
                                                className="opacity-60 hover:opacity-100"
                                            />
                                        </Tooltip>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Text strong className="text-blue-600">
                                                {formatPrice(item.price)}
                                            </Text>
                                            {item.unit && (
                                                <Text className="text-gray-500 ml-1">
                                                    /{item.unit}
                                                </Text>
                                            )}
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <Text delete className="text-gray-400 text-xs ml-2">
                                                    {formatPrice(item.originalPrice)}
                                                </Text>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<MinusOutlined />}
                                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                                disabled={isLoading || item.quantity <= 1}
                                                className="w-8 h-8 flex items-center justify-center"
                                            />
                                            <InputNumber
                                                min={1}
                                                max={item.maxQuantity}
                                                value={item.quantity}
                                                onChange={(value) => handleQuantityUpdate(item.id, value || 1)}
                                                size="small"
                                                className="w-16 text-center"
                                                disabled={isLoading}
                                                controls={false}
                                            />
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                                disabled={isLoading || (item.maxQuantity ? item.quantity >= item.maxQuantity : false)}
                                                className="w-8 h-8 flex items-center justify-center"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <Text className="text-xs text-gray-500">Sous-total:</Text>
                                            <Text strong className="text-green-600">
                                                {formatPrice(item.price * item.quantity)}
                                            </Text>
                                        </div>
                                        {item.rating && (
                                            <div className="flex items-center space-x-1">
                                                <StarFilled className="text-yellow-400 text-xs" />
                                                <Text className="text-xs text-gray-600">{item.rating}</Text>
                                            </div>
                                        )}
                                    </div>

                                    {item.maxQuantity && item.quantity >= item.maxQuantity * 0.8 && (
                                        <div className="bg-orange-50 border-l-4 border-orange-400 p-2 rounded">
                                            <Text className="text-xs text-orange-700">
                                                Stock limité - Plus que {item.maxQuantity - item.quantity} disponible(s)
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Drawer>
    );

    // Menu mobile professionnel
    const ProfessionalMobileMenu = () => (
        <div className="space-y-2 p-4">
            {[
                {
                    key: 'suppliers',
                    icon: ShopOutlined,
                    label: 'Fournisseurs',
                    path: '/fournisseurs',
                    description: 'Découvrir nos partenaires'
                },
                {
                    key: 'resellers',
                    icon: TeamOutlined,
                    label: 'Revendeurs',
                    path: '/revendeurs',
                    description: 'Réseau de distribution'
                },
                {
                    key: 'stock',
                    icon: FileTextOutlined,
                    label: 'Stock',
                    path: '/stock',
                    description: 'Inventaire disponible'
                },
                {
                    key: 'about',
                    icon: GlobalOutlined,
                    label: 'À propos',
                    path: '/about',
                    description: 'Notre entreprise'
                },
            ].map((item) => (
                <button
                    key={item.key}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center space-x-4 w-full p-4 text-left text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-xl transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                        <item.icon className="text-lg" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                </button>
            ))}

            <Divider />

            <div className="space-y-3 p-2">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <PhoneOutlined />
                    <span>+225 XX XX XX XX</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MailOutlined />
                    <span>contact@terminal-echanges.ci</span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <nav className="bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo et branding professionnel */}
                        <div
                            onClick={() => handleNavigation('/')}
                            className="cursor-pointer flex items-center space-x-4 hover:opacity-90 transition-opacity"
                        >
                            <div className="relative">
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <img src="/images/logob.png" alt="Logo" className="w-10 h-10" />
                                </div>
                                {/* <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                    <SafetyCertificateOutlined className="text-white text-xs" />
                                </div> */}
                            </div>
                            <div className="hidden lg:block text-white">
                                <Title level={3} className="!mb-0 !text-black font-bold">
                                    Terminal d'Échanges
                                </Title>
                               {/*  <div className="flex items-center space-x-2">
                                    <Text className="text-blue-100 text-sm">Plateforme B2B Professionnelle</Text>
                                    <Tag className="premium-badge text-xs">
                                        Premium
                                    </Tag>
                                </div> */}
                            </div>
                        </div>

                        {/* Barre de recherche centrale */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <Input.Search
                                placeholder="Rechercher des produits, fournisseurs..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onSearch={handleSearch}
                                size="large"
                                className="search-input"
                                suffix={
                                    <SearchOutlined className="text-gray-400" />
                                } />
                        </div>

                        {/* Actions utilisateur */}
                        <div className="flex items-center space-x-4">
                            {/* Bouton de recherche mobile */}
                            <Button
                                type="text"
                                icon={<SearchOutlined className="text-white text-xl" />}
                                className="md:hidden"
                                onClick={() => {
                                    notification.info({
                                        message: 'Recherche',
                                        description: 'Utilisez la barre de recherche principale',
                                        placement: 'topRight',
                                    });
                                }}
                            />

                            {/* Bouton notifications */}
                           {/*  <Badge count={notifications} className="hidden sm:block"> */}
                                <Button
                                    type="text"
                                    icon={<BellOutlined className="force-white-icon text-xl" />}
                                    className="flex items-center justify-center t"
                                />
{/*                             </Badge> */}

                            {/* Bouton panier */}
                            <Badge count={totalItems} className="hidden sm:block">
                                <Button
                                    type="text"
                                    icon={<ShoppingCartOutlined className="force-white-icon text-xl" />}
                                    onClick={() => setCartDrawerOpen(true)}
                                    className="flex items-center justify-center"
                                />
                            </Badge>

                            {/* Menu utilisateur ou bouton de connexion */}
                            {user ? (
                                <Dropdown
                                    menu={{ items: getUserMenuItems() }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                    className="user-dropdown"
                                >
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <Avatar
                                            size="large"
                                            src={user.picture}
                                            icon={<UserOutlined />}
                                            className="border-2 border-white shadow"
                                        />
                                        <div className="hidden lg:block text-white text-left">
                                            <div className="font-medium text-sm">{user.name}</div>
                                            <div className="text-xs text-blue-100 flex items-center">
                                                {user.role === 'buyer' ? 'Acheteur' : 'Fournisseur'}
                                                {user.verified && (
                                                    <SafetyCertificateOutlined className="ml-1 text-green-300" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Dropdown>
                            ) : (
                                <Button
                                    type="primary"
                                    className="professional-button"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Connexion
                                </Button>
                            )}

                            {/* Bouton menu mobile */}
                            <Button
                                type="text"
                                icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                                className="text-white text-xl md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Drawer du panier */}
            <ProfessionalCartDrawer />

            {/* Menu mobile */}
            <Drawer
                title={
                    <div className="flex items-center space-x-3">
                        <img src="/images/logob.png" alt="Logo" className="w-8 h-8" />
                        <Title level={4} className="!mb-0">
                            Terminal d'Échanges
                        </Title>
                    </div>
                }
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={320}
                className="professional-mobile-drawer"
            >
                <ProfessionalMobileMenu />
            </Drawer>
        </>
    );
};

export default Navbar;