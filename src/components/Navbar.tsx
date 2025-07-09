import React, { useState, useEffect } from 'react';
import {
    ShoppingCartOutlined,
    ShopOutlined,
    TeamOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Badge, Drawer } from 'antd';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

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
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        // Simulate user data
        const mockUser = {
            id: '1',
            name: 'ABC Commerce SARL',
            raisonSociale: 'ABC Commerce SARL',
            role: 'revendeur', // 'fournisseur', 'revendeur', 'admin'
            email: 'contact@abccommerce.com',
            picture: null
        };
        setUser(mockUser);

        // Simulate cart count
        setCartCount(3);
    }, []);

  

    const handleNavigation = (path: string) => {
        navigate(path);
    };

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
                            <div className="w-12 h-12 -to-r  rounded-lg flex items-center justify-center shadow-md">
                                <img src="/images/logob.png" alt="Logo" className="w-8 h-8" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold text-gray-800">Terminal d'Échanges</h1>
                                <p className="text-sm text-gray-500">Plateforme B2B</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleNavigation('/panier')}
                                    className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                                >
                                    <Badge count={cartCount} size="small">
                                        <ShoppingCartOutlined className="text-xl" />
                                    </Badge>
                                </button>

                                <button
                                    className="px-6 py-2 bg-none text-black rounded-lg font-medium border cursor-pointer"
                                    onClick={() => handleNavigation('/login')}
                                >
                                    Connexion
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Barre d'informations défilantes */}
                <div className="bg-gray-300 border-t border-gray-200 py-2 overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap">
                        <span className="mx-4 text-sm text-gray-700">💳 <strong>Moyens de paiement:</strong> Mixx by Yas: 90291421</span>
                        <span className="mx-4 text-sm text-gray-700">💳 Flooz: 98042314</span>
                        <span className="mx-4 text-sm text-gray-700">🏦 NSIA Banque: 260081527014</span>
                        <span className="mx-4 text-sm text-gray-700">📈 <strong>Taux USD/FCFA:</strong> 1 USD = 615 FCFA</span>
                        <span className="mx-4 text-sm text-gray-700">💰 <strong>Crypto:</strong> Bitcoin: 45,230 USD</span>
                        <span className="mx-4 text-sm text-gray-700">🏛️ <strong>Banque Centrale:</strong> Taux directeur: 2.5%</span>
                        <span className="mx-4 text-sm text-gray-700">🌍 <strong>Commerce:</strong> CEDEAO - Zone de libre-échange</span>
                        <span className="mx-4 text-sm text-gray-700">⚡ <strong>Frais de transfert:</strong> Mobile Money: 1-3%</span>
                        <span className="mx-4 text-sm text-gray-700">🎯 <strong>Terminal d'Échanges:</strong> Plateforme B2B sécurisée</span>

                        {/* Répétition pour un défilement continu */}
                        <span className="mx-4 text-sm text-gray-700">💳 <strong>Moyens de paiement:</strong> Mixx by Yas: 90291421</span>
                        <span className="mx-4 text-sm text-gray-700">💳 Flooz: 98042314</span>
                        <span className="mx-4 text-sm text-gray-700">🏦 NSIA Banque: 260081527014</span>
                        <span className="mx-4 text-sm text-gray-700">📈 <strong>Taux USD/FCFA:</strong> 1 USD = 615 FCFA</span>
                        <span className="mx-4 text-sm text-gray-700">💰 <strong>Crypto:</strong> Bitcoin: 45,230 USD</span>
                        <span className="mx-4 text-sm text-gray-700">🏛️ <strong>Banque Centrale:</strong> Taux directeur: 2.5%</span>
                        <span className="mx-4 text-sm text-gray-700">🌍 <strong>Commerce:</strong> CEDEAO - Zone de libre-échange</span>
                        <span className="mx-4 text-sm text-gray-700">⚡ <strong>Frais de transfert:</strong> Mobile Money: 1-3%</span>
                        <span className="mx-4 text-sm text-gray-700">🎯 <strong>Terminal d'Échanges:</strong> Plateforme B2B sécurisée</span>
                    </div>
                </div>
            </nav>

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