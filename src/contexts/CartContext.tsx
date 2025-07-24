import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearCartMutation, useCreateOrUpdateCartMutation, useGetUserCartQuery } from '../services/api';
import toast from 'react-hot-toast';

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
    loadCartFromAPI: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [clearCartFromApi] = useClearCartMutation();
    const [updateCart] = useCreateOrUpdateCartMutation();
    
    // Récupérer le userId depuis le localStorage
    const getUserId = () => localStorage.getItem('userId');
    const userId = getUserId();
    console.log('User ID:', userId);
    
    // Utiliser le hook de requête avec le userId seulement s'il existe
    const { data: cartData, refetch: refetchCart } = useGetUserCartQuery({ userId }, {
        skip: !getUserId(),
    });

    // Références pour contrôler les appels
    const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSyncRef = useRef<string>('');
    const isMountedRef = useRef(false);

    // Chargement initial depuis localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            } catch (error) {
                console.error('Erreur localStorage:', error);
                setCartItems([]);
            }
        }
        isMountedRef.current = true;
    }, []);

    // Synchronisation avec l'API
    const syncCartWithAPI = useCallback(async (updatedCartItems: CartItem[]) => {
        const userId = getUserId();
        if (!userId) return;

        const itemsKey = JSON.stringify(updatedCartItems.map(i => `${i.id}:${i.quantity}`));
        
        if (lastSyncRef.current === itemsKey) return;
        lastSyncRef.current = itemsKey;

        try {
            const formattedCartItems = updatedCartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }));

            await updateCart({
                userId: userId,
                cartItems: formattedCartItems
            }).unwrap();

        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Erreur de synchronisation');
            lastSyncRef.current = '';
        }
    }, [updateCart]);

    // Debounce pour la synchronisation
    const debouncedSync = useCallback((updatedCartItems: CartItem[]) => {
        if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
        }
        
        syncTimeoutRef.current = setTimeout(() => {
            syncCartWithAPI(updatedCartItems);
        }, 1000);
    }, [syncCartWithAPI]);

    // Sauvegarde locale et synchronisation
    useEffect(() => {
        if (!isMountedRef.current) return;

        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        const userId = getUserId();
        if (userId && cartItems.length >= 0) {
            debouncedSync(cartItems);
        }
    }, [cartItems, debouncedSync]);

    // Chargement depuis l'API
    const loadCartFromAPI = useCallback(async () => {
        const userId = getUserId();
        if (!userId) return;

        setIsLoading(true);
        try {
            const { data } = await refetchCart();
            
            if (data?.items) {
                const apiCartItems: CartItem[] = data.items.map((item: any) => ({
                    id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.avgPrice || 0,
                    quantity: item.quantity,
                    image: item.productId.images?.[0] || '',
                    supplierId: item.productId.supplierId,
                    supplierName: item.productId.supplierName || 'Fournisseur',
                    unit: item.productId.unitOfMeasure || 'piece',
                    maxQuantity: item.productId.maxQuantity,
                }));
                
                isMountedRef.current = false;
                setCartItems(apiCartItems);
                localStorage.setItem('cart', JSON.stringify(apiCartItems));
                setTimeout(() => { isMountedRef.current = true; }, 100);
                
                toast.success('Panier synchronisé !');
            }
        } catch (error) {
            console.error('Load from API error:', error);
            toast.error('Erreur de chargement du panier');
        } finally {
            setIsLoading(false);
        }
    }, [refetchCart]);

    // Actions du panier
    const addToCart = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        const userId = getUserId();
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
        
        toast.success('Ajouté au panier !');
    }, [navigate]);

    const removeFromCart = useCallback((itemId: string) => {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        toast.success('Retiré du panier !');
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
        const userId = getUserId();
        
        setCartItems([]);
        
        if (userId) {
            try {
                await clearCartFromApi({ userId }).unwrap();
                toast.success('Panier vidé !');
            } catch (error) {
                toast.error('Erreur lors du vidage');
            }
        }
    }, [clearCartFromApi]);

    const setCartItemsDirectly = useCallback((items: CartItem[]) => {
        isMountedRef.current = false;
        setCartItems(items);
        setTimeout(() => { isMountedRef.current = true; }, 100);
    }, []);

    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const getTotalItems = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    // Cleanup
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
                loadCartFromAPI,
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