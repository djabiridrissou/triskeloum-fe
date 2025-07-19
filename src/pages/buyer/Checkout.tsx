import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '../../contexts/CartContext';
import { useOrderItemsMutation, useUpdateBuyerMutation } from '../../services/api';
import { 
    DeleteOutlined, 
    PlusOutlined, 
    MinusOutlined, 
    ShopOutlined,
    EnvironmentOutlined,
    ShoppingCartOutlined,
    InfoCircleOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { Button, InputNumber, Card, Divider, Alert, Spin } from 'antd';
import Swal from 'sweetalert2';

interface DeliveryAddress {
    address: string;
    addressComplement?: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
}

interface OrderData {
    items: any[];
    deliveryAddress: DeliveryAddress;
    totalPrice: number;
    totalItems: number;
    orderDate: string;
    orderNumber: string;
    customerEmail: string;
    notes?: string;
}

const CheckoutPage: React.FC = () => {
    const { 
        cartItems, 
        getTotalPrice, 
        getTotalItems, 
        clearCart, 
        removeFromCart, 
        updateQuantity,
        isLoading: cartLoading 
    } = useCartContext();
    
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<DeliveryAddress>>({});
    const [currency, setCurrency] = useState('XOF');
    const deliveryFee = 2000;
    const [orderItems, { isLoading: isOrdering }] = useOrderItemsMutation();
    const [updateUser] = useUpdateBuyerMutation();

    const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
        address: '',
        addressComplement: '',
        city: '',
        postalCode: '',
        country: 'Togo',
        phone: '',
    });

    const [notes, setNotes] = useState('');

    // Rediriger si le panier est vide
    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [cartItems, navigate]);

    // Charger la devise
    useEffect(() => {
        const userCurrency = localStorage.getItem('userCurrency');
        if (userCurrency) {
            setCurrency(userCurrency);
        }
    }, []);

    const handleInputChange = (field: keyof DeliveryAddress, value: string) => {
        setDeliveryAddress(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<DeliveryAddress> = {};

        if (!deliveryAddress.address.trim()) newErrors.address = 'L\'adresse est requise';
        if (!deliveryAddress.city.trim()) newErrors.city = 'La ville est requise';
        if (!deliveryAddress.postalCode.trim()) newErrors.postalCode = 'Le code postal est requis';
        if (!deliveryAddress.phone.trim()) newErrors.phone = 'Le téléphone est requis';

        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (deliveryAddress.phone && !phoneRegex.test(deliveryAddress.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Format de téléphone invalide';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateOrderNumber = (): string => {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `CMD-${timestamp}-${random}`.toUpperCase();
    };

    const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            handleRemoveItem(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleRemoveItem = (itemId: string) => {
        Swal.fire({
            title: 'Supprimer cet article ?',
            text: 'Voulez-vous vraiment retirer cet article de votre panier ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                removeFromCart(itemId);
            }
        });
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData: OrderData = {
                items: cartItems,
                deliveryAddress,
                totalPrice: getTotalPrice() + deliveryFee,
                totalItems: getTotalItems(),
                orderDate: new Date().toISOString(),
                orderNumber: generateOrderNumber(),
                customerEmail: localStorage.getItem('userEmail') || '',
                notes: notes.trim() || undefined,
            };

            const addresses = [{
                address: orderData.deliveryAddress.address,
                addressComplement: orderData.deliveryAddress.addressComplement,
                city: orderData.deliveryAddress.city,
                postalCode: orderData.deliveryAddress.postalCode,
                country: orderData.deliveryAddress.country
            }];

            const userId = localStorage.getItem('userId') || '';
            await updateUser({
                id: userId,
                data: { addresses }
            }).unwrap();

            const items = orderData.items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            }));

            await orderItems({
                items,
                notes: orderData.notes
            }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Commande créée avec succès',
                text: 'Vous recevrez une notification quand votre commande sera traitée.',
                confirmButtonText: 'OK',
            });
            
            clearCart();
            navigate('/buyer/orders');

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur s\'est produite lors de la création de votre commande. Veuillez réessayer.',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: currency === 'XOF' ? 0 : 2
        }).format(price);
    };

    const isLoading = isSubmitting || isOrdering || cartLoading;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Finaliser votre commande
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Vérifiez vos articles et renseignez vos informations de livraison
                            </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                            <Button 
                                type="default" 
                                onClick={() => navigate('/cart')}
                                className="w-full sm:w-auto"
                            >
                                Retour au panier
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Formulaire d'adresse - Prend 2 colonnes sur xl */}
                    <div className="xl:col-span-2 space-y-6">
                        <Card className="shadow-sm">
                            <div className="flex items-center mb-6">
                                <EnvironmentOutlined className="text-blue-600 text-xl mr-3" />
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                    Adresse de livraison
                                </h2>
                            </div>

                            <form onSubmit={handleSubmitOrder} className="space-y-4 sm:space-y-5">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Adresse *
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryAddress.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Numéro et nom de rue"
                                            disabled={isLoading}
                                        />
                                        {errors.address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Complément d'adresse (optionnel)
                                        </label>
                                        <input
                                            type="text"
                                            value={deliveryAddress.addressComplement}
                                            onChange={(e) => handleInputChange('addressComplement', e.target.value)}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            placeholder="Appartement, étage, bâtiment..."
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ville *
                                            </label>
                                            <input
                                                type="text"
                                                value={deliveryAddress.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Ville"
                                                disabled={isLoading}
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Code postal *
                                            </label>
                                            <input
                                                type="text"
                                                value={deliveryAddress.postalCode}
                                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.postalCode ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Code postal"
                                                disabled={isLoading}
                                            />
                                            {errors.postalCode && (
                                                <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pays *
                                            </label>
                                            <select
                                                value={deliveryAddress.country}
                                                onChange={(e) => handleInputChange('country', e.target.value)}
                                                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                                disabled={isLoading}
                                            >
                                                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                                <option value="Ghana">Ghana</option>
                                                <option value="Burkina Faso">Burkina Faso</option>
                                                <option value="Mali">Mali</option>
                                                <option value="Sénégal">Sénégal</option>
                                                <option value="Niger">Niger</option>
                                                <option value="Bénin">Bénin</option>
                                                <option value="Togo">Togo</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Téléphone *
                                            </label>
                                            <input
                                                type="tel"
                                                value={deliveryAddress.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="+228 70 60 92 43"
                                                disabled={isLoading}
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes additionnelles (optionnel)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                                            placeholder="Instructions de livraison, allergies, préférences..."
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </form>
                        </Card>

                        {/* Articles mobiles - Visible seulement sur mobile */}
                        <div className="xl:hidden">
                            <Card className="shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <ShoppingCartOutlined className="text-green-600 text-xl mr-3" />
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Vos articles ({getTotalItems()})
                                        </h2>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {cartItems.map((item: any) => (
                                        <div key={item.id} className="border rounded-lg p-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${item.image}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <ShopOutlined className="text-gray-400 text-xl" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 truncate mb-3">{item.supplierName}</p>
                                                    
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm font-semibold text-blue-600">
                                                            {formatPrice(item.price)}
                                                            {item.unit && <span className="text-gray-500">/{item.unit}</span>}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Quantité et suppression sur mobile */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<MinusOutlined />}
                                                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                                                disabled={isLoading}
                                                                className="w-8 h-8 flex items-center justify-center p-0 border border-gray-200"
                                                            />
                                                            <InputNumber
                                                                min={1}
                                                                max={item.maxQuantity}
                                                                value={item.quantity}
                                                                onChange={(value) => handleQuantityUpdate(item.id, value || 1)}
                                                                size="small"
                                                                disabled={isLoading}
                                                                controls={false}
                                                                className="w-16 text-center"
                                                                style={{ 
                                                                    borderRadius: '6px',
                                                                    textAlign: 'center'
                                                                }}
                                                            />
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<PlusOutlined />}
                                                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                                                disabled={isLoading || (item.maxQuantity ? item.quantity >= item.maxQuantity : false)}
                                                                className="w-8 h-8 flex items-center justify-center p-0 border border-gray-200"
                                                            />
                                                        </div>
                                                        
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={isLoading}
                                                            className="w-8 h-8 flex items-center justify-center p-0"
                                                        />
                                                    </div>
                                                    
                                                    <div className="mt-3 pt-2 border-t border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600">Sous-total:</span>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Récapitulatif de commande - Sidebar desktop */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-4">
                            <Card className="shadow-sm">
                                <div className="flex items-center mb-6">
                                    <ShoppingCartOutlined className="text-green-600 text-xl mr-3" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        Récapitulatif
                                    </h2>
                                </div>

                                {/* Articles desktop - Caché sur mobile */}
                                <div className="hidden xl:block space-y-3 mb-6">
                                    {cartItems.map((item: any) => (
                                        <div key={item.id} className="border rounded-lg p-3">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${item.image}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <ShopOutlined className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                                                    <p className="text-xs text-gray-600 truncate">{item.supplierName}</p>
                                                    
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-blue-600">
                                                            {formatPrice(item.price)}
                                                            {item.unit && <span className="text-gray-500">/{item.unit}</span>}
                                                        </span>
                                                        <div className="flex items-center space-x-1">
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<MinusOutlined style={{ fontSize: '10px' }} />}
                                                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                                                disabled={isLoading}
                                                                className="w-6 h-6 flex items-center justify-center p-0"
                                                            />
                                                            <InputNumber
                                                                min={1}
                                                                max={item.maxQuantity}
                                                                value={item.quantity}
                                                                onChange={(value) => handleQuantityUpdate(item.id, value || 1)}
                                                                size="small"
                                                                className="w-12"
                                                                disabled={isLoading}
                                                                controls={{ upIcon: null, downIcon: null }}
                                                                style={{ fontSize: '12px' }}
                                                            />
                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                icon={<PlusOutlined style={{ fontSize: '10px' }} />}
                                                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                                                disabled={isLoading || (item.maxQuantity ? item.quantity >= item.maxQuantity : false)}
                                                                className="w-6 h-6 flex items-center justify-center p-0"
                                                            />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-xs font-medium text-gray-900">
                                                            Total: {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                        <Button
                                                            type="text"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={isLoading}
                                                            className="w-6 h-6 flex items-center justify-center p-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Divider />

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Sous-total ({getTotalItems()} articles)</span>
                                        <span className="text-gray-900 font-medium">{formatPrice(getTotalPrice())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Frais de livraison</span>
                                        <span className="text-gray-900 font-medium">{formatPrice(deliveryFee)}</span>
                                    </div>
                                    <Divider />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600">{formatPrice(getTotalPrice() + deliveryFee)}</span>
                                    </div>
                                </div>

                                <Alert
                                    icon={<InfoCircleOutlined />}
                                    message="Modalités de paiement"
                                    description="Un administrateur examinera votre commande et vous contactera pour procéder au paiement."
                                    type="info"
                                    showIcon
                                    className="mt-6"
                                />

                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleSubmitOrder}
                                    loading={isLoading}
                                    disabled={isLoading || cartItems.length === 0}
                                    className="w-full mt-6 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 border-none"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: 'white' }} spin />} />
                                            <span className="ml-2">Traitement en cours...</span>
                                        </span>
                                    ) : (
                                        'Confirmer la commande'
                                    )}
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;