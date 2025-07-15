import React, { useState, useEffect } from 'react';
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
} from '@ant-design/icons';
import { Badge, Drawer, Button, Avatar, Dropdown, Empty, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useCartContext } from '../contexts/CartContext';
 // Import from your new CartContext

interface User {
    id: string;
    name: string;
    raisonSociale: string;
    role: 'buyer' | 'supplier' | 'admin';
    email: string;
    picture?: string;
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const navigate = useNavigate();
    
    // Use the cart context
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
    } = useCartContext();

    // Ajouter le CSS d'animation au head
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
            }
            .animate-marquee {
                animation: marquee 60s linear infinite;
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    // Vérifier l'état de connexion
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
                });
            } else {
                setUser(null);
            }
        };

        checkAuthStatus();
        
        // Écouter les changements dans localStorage
        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
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

    // Menu utilisateur connecté
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Mon profil',
            icon: <UserOutlined />,
            onClick: () => handleNavigation('/profile'),
        },
        {
            key: 'orders',
            label: 'Mes commandes',
            icon: <FileTextOutlined />,
            onClick: () => handleNavigation('/orders'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Déconnexion',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    // Composant du panier
    const CartDrawer = () => (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <span>Panier ({getTotalItems()} articles)</span>
                    {cartItems.length > 0 && (
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={clearCart}
                        >
                            Vider
                        </Button>
                    )}
                </div>
            }
            placement="right"
            onClose={() => setCartDrawerOpen(false)}
            open={cartDrawerOpen}
            width={400}
            footer={
                cartItems.length > 0 ? (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Total:</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                type="default"
                                size="large"
                                className="flex-1"
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
                                className="flex-1"
                                onClick={() => {
                                    setCartDrawerOpen(false);
                                    handleNavigation('/checkout');
                                }}
                            >
                                Commander
                            </Button>
                        </div>
                    </div>
                ) : null
            }
        >
            {cartItems.length === 0 ? (
                <Empty
                    description="Votre panier est vide"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item: any) => (
                        <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ShopOutlined className="text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{item.supplierName}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-blue-600">
                                            {formatPrice(item.price)}
                                            {item.unit && <span className="text-gray-500">/{item.unit}</span>}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<MinusOutlined />}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            />
                                            <InputNumber
                                                min={1}
                                                max={item.maxQuantity}
                                                value={item.quantity}
                                                onChange={(value) => updateQuantity(item.id, value || 1)}
                                                size="small"
                                                className="w-16"
                                            />
                                            <Button
                                                type="text"
                                                size="small"
                                                icon={<PlusOutlined />}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.maxQuantity ? item.quantity >= item.maxQuantity : false}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">
                                            Sous-total: {formatPrice(item.price * item.quantity)}
                                        </span>
                                        <Button
                                            type="text"
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeFromCart(item.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Drawer>
    );

    // Menu mobile
    const mobileMenu = (
        <div className="space-y-4">
            <button
                onClick={() => handleNavigation('/fournisseurs')}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
                <ShopOutlined />
                <span>Fournisseurs</span>
            </button>
            <button
                onClick={() => handleNavigation('/revendeurs')}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
                <TeamOutlined />
                <span>Revendeurs</span>
            </button>
            <button
                onClick={() => handleNavigation('/stock')}
                className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
                <FileTextOutlined />
                <span>Stock</span>
            </button>
        </div>
    );

    return (
        <>
            <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo et nom de l'entreprise */}
                        <div
                            onClick={() => handleNavigation('/')}
                            className="cursor-pointer flex items-center space-x-3"
                        >
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md">
                                <img src="/images/logob.png" alt="Logo" className="w-8 h-8" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-800">Terminal d'Échanges</h1>
                                <p className="text-sm text-gray-500">Plateforme B2B</p>
                            </div>
                        </div>

                        {/* Actions utilisateur */}
                        <div className="flex items-center space-x-4">
                            {/* Panier - Affiché uniquement pour les buyers connectés et non connectés */}
                            {(!user || user.role === 'buyer') && (
                                <button
                                    onClick={() => user ? setCartDrawerOpen(true) : navigate('/login')}
                                    className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                                    title={user ? 'Ouvrir le panier' : 'Connectez-vous pour voir votre panier'}
                                >
                                    <Badge count={user ? getTotalItems() : 0} size="small">
                                        <ShoppingCartOutlined className="text-xl" />
                                    </Badge>
                                </button>
                            )}

                            {/* Utilisateur connecté */}
                            {user ? (
                                <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                                    <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                        <Avatar
                                            size="small"
                                            icon={<UserOutlined />}
                                            src={user.picture}
                                        />
                                        <div className="hidden sm:block">
                                            <p className="text-sm font-medium text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                </Dropdown>
                            ) : (
                                /* Bouton de connexion pour utilisateurs non connectés */
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Connexion
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Drawer du panier */}
            <CartDrawer />

            {/* Menu mobile drawer */}
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
            >
                {mobileMenu}
            </Drawer>
        </>
    );
};

export default Navbar;