import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearCartMutation } from '../services/api';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    supplierId: string;
    supplierName: string;
    unit?: string;
    maxQuantity?: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    setCartItems: (items: CartItem[]) => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [clearCartFromApi] = useClearCartMutation();
    
    // Référence pour éviter les appels API multiples
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialLoadRef = useRef(true);

    // Fonction pour synchroniser avec l'API (debounced)
    const syncCartWithAPI = useCallback(async (updatedCartItems: CartItem[]) => {
        try {
            // Récupérer l'userId depuis localStorage
            const userId = localStorage.getItem('userId');
            
            if (!userId) {
                console.error('UserId non trouvé dans localStorage');
                return;
            }

            // Ne pas montrer le loading pour les mises à jour rapides
            // setIsLoading(true);

            // Transformer les items du contexte au format attendu par l'API
            const formattedCartItems = updatedCartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            const response = await fetch('/api/cart/create-u', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Ajoutez vos headers d'authentification si nécessaire
                    // 'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: userId,
                    cartItems: formattedCartItems
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Panier synchronisé avec succès:', result.message);

        } catch (error) {
            console.error('Erreur lors de la synchronisation du panier:', error);
            // Vous pouvez afficher une notification d'erreur ici
        } finally {
            // setIsLoading(false);
        }
    }, []);

    // Fonction debounced pour éviter trop d'appels API
    const debouncedSync = useCallback((updatedCartItems: CartItem[]) => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }
        
        syncTimeoutRef.current = setTimeout(() => {
            syncCartWithAPI(updatedCartItems);
        }, 500); // Attendre 500ms avant de synchroniser
    }, [syncCartWithAPI]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Erreur de chargement du panier:', error);
                setCartItems([]);
            }
        }
        isInitialLoadRef.current = false;
    }, []);

    useEffect(() => {
        // Sauvegarder dans localStorage immédiatement
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Synchroniser avec l'API seulement si ce n'est pas le chargement initial
        if (!isInitialLoadRef.current) {
            const userId = localStorage.getItem('userId');
            if (userId) {
                debouncedSync(cartItems);
            }
        }
    }, [cartItems, debouncedSync]);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        // Vérifier si l'utilisateur est connecté
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        setCartItems(prev => {
            const existingItem = prev.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prev.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                        : cartItem
                );
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
    }, [navigate]);

    const removeFromCart = useCallback((itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCartItems(prev =>
            prev.map(item => (item.id === itemId ? { ...item, quantity } : item))
        );
    }, [removeFromCart]);

    const clearCart = useCallback(async () => {
        setCartItems([]);
        const userId = localStorage.getItem('userId') && debouncedSync([]);
        await clearCartFromApi({ userId }); // Synchroniser avec l'API
    }, []);

    // Nouvelle méthode pour définir directement les items du panier
    const setCartItemsDirectly = useCallback((items: CartItem[]) => {
        isInitialLoadRef.current = true; // Marquer comme chargement initial pour éviter la sync
        setCartItems(items);
        setTimeout(() => {
            isInitialLoadRef.current = false;
        }, 100);
    }, []);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const getTotalItems = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    // Nettoyer le timeout au démontage
    useEffect(() => {
        return () => {
            if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
            }
        };
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                setCartItems: setCartItemsDirectly,
                getTotalPrice,
                getTotalItems,
                isLoading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext must be used within a CartProvider');
    }
    return context;
};