// src/components/auth/LoginComponent.tsx
import { useState, useEffect, JSX } from "react";
import { Button, Input, Card, Form, Checkbox, Divider } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Shield, Globe } from "lucide-react";
import { api, useLoginMutation, useGetUserCartQuery } from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCartContext } from "../../contexts/CartContext";

interface Slide {
    image: string;
    title: string;
    subtitle: string;
    icon: JSX.Element;
}

const Login = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setCartItems, cartItems } = useCartContext(); // Utilisation du contexte

    const { data: cartData, isSuccess: cartSuccess } = useGetUserCartQuery(userId, {
        skip: !userId, // Skip la query si userId n'est pas défini
    });

    console.log('Cart Data:', cartData); // Debug

    useEffect(() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currency');
        localStorage.removeItem('ressource');
        localStorage.removeItem('feeAmount');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        
        // Invalidate all cached queries
        dispatch(api.util.invalidateTags(['User']));
    }, [dispatch]);

    // Synchroniser le panier quand on récupère les données du serveur
    useEffect(() => {
        if (cartSuccess && cartData?.success && cartData?.data) {
            const serverCartItems = cartData.data.items || [];
            
        
            const formattedServerItems = formatServerCartItems(serverCartItems);
            const localCartItems = cartItems;
            const mergedCart = mergeCartItems(localCartItems, formattedServerItems);
            
    
            setCartItems(mergedCart);
        }
    }, [cartSuccess, cartData, setCartItems]);

    // Fonction pour transformer les items du serveur au format du contexte
    const formatServerCartItems = (serverItems: any[]) => {
        return serverItems.map(serverItem => ({
            id: serverItem.productId._id || serverItem.productId,
            name: serverItem.productId.name || serverItem.productId.designation || '',
            price: serverItem.productId.avgPrice || 0,
            quantity: serverItem.quantity || 1,
            image: serverItem.productId.image || serverItem.productId.images?.[0] || '',
            supplierId: serverItem.productId.supplierId._id || serverItem.productId.userId || '',
            supplierName: serverItem.productId.supplierId.name || serverItem.productId.companyName || '',
            unit: serverItem.productId.unitOfMeasure || '',
            maxQuantity: serverItem.productId.maxQuantity || serverItem.productId.stock || 999
        }));
    };

    // Fonction pour merger les paniers local et serveur
    const mergeCartItems = (localItems: any[], serverItems: any[]) => {
        const merged = [...serverItems];
        localItems.forEach(localItem => {
            const existsOnServer = serverItems.find(serverItem => serverItem.id === localItem.id);
            if (!existsOnServer) {
                merged.push(localItem);
            } else {
                const serverItem = merged.find(item => item.id === localItem.id);
                if (serverItem && localItem.quantity > serverItem.quantity) {
                    serverItem.quantity = localItem.quantity;
                }
            }
        });
        
        return merged;
    };

    const slides: Slide[] = [
        {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Connectez-vous avec des Fournisseurs",
            subtitle: "Accédez à un réseau mondial de fournisseurs de confiance",
            icon: <Users className="w-8 h-8 text-blue-400" />
        },
        {
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Développez votre Business",
            subtitle: "Augmentez vos ventes grâce à notre plateforme d'échanges",
            icon: <TrendingUp className="w-8 h-8 text-green-400" />
        },
        {
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Sécurité Garantie",
            subtitle: "Transactions sécurisées avec notre fiche d'échanges",
            icon: <Shield className="w-8 h-8 text-purple-400" />
        },
        {
            image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Portée Internationale",
            subtitle: "Étendez votre présence sur les marchés internationaux",
            icon: <Globe className="w-8 h-8 text-orange-400" />
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleLogin = async (values: { email: string; password: string }) => {
        const credentials = {
            email: values.email,
            password: values.password
        };

        try {
            const result = await login(credentials);

            if ('error' in result) {
                console.log('Login error:', result.error);
                const error = result.error as any;
                const status = error?.status || error?.data?.error?.statusCode;
                const message = error?.data?.error?.message || error?.data?.message || error?.message;

                switch (status) {
                    case 404:
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur de connexion',
                            text: message || 'Utilisateur non trouvé.',
                        });
                        break;

                    case 401:
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur de connexion',
                            text: message || 'Mot de passe invalide.',
                        });
                        break;

                    case 402:
                        const details = error?.data?.error?.details || {};
                        localStorage.setItem('ressource', details.ressource || '');
                        localStorage.setItem('userId', details.userId || '');
                        localStorage.setItem('currency', details.currency || '');
                        localStorage.setItem('feeAmount', details.amount || '');
                        Swal.fire({
                            icon: 'warning',
                            title: 'Paiement requis',
                            text: message || 'Procédez au paiement des frais d\'inscription.',
                        });
                        navigate('/fees');
                        break;

                    case 403:
                        Swal.fire({
                            icon: 'warning',
                            title: 'Compte en attente',
                            text: message || 'Votre compte est en attente de validation.',
                        });
                        break;

                    default:
                        Swal.fire({
                            icon: 'error',
                            title: 'Erreur de connexion',
                            text: message || 'Une erreur s\'est produite lors de la connexion.',
                        });
                        break;
                }
                return;
            }

            // Cas de succès
            const response = result.data;
 // Debug

            dispatch(api.util.invalidateTags(['User']));
            const userRole = response.data.isBuyer
                ? 'buyer'
                : response.data.isRepresentative
                    ? 'supplier'
                    : 'admin';

            // Stocker les données utilisateur dans le localStorage
            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userId', response.data._id);
            localStorage.setItem('userName', response.data.socialReason || response.data.name);
            localStorage.setItem('userRole', userRole);

            // Déclencher la récupération du panier en définissant l'userId
            setUserId(response.data._id);

            // Afficher le message de succès
            Swal.fire({
                icon: 'success',
                title: 'Connexion réussie',
                text: response.message || 'Vous êtes connecté avec succès.',
                timer: 2000,
                showConfirmButton: false,
            });

           console.log('Navigating to user dashboard: ', userRole); // Debug
            setTimeout(() => {
                if (userRole === 'buyer') {
                    navigate('/buyer/home');
                } else if (userRole === 'supplier') {
                    navigate('/supplier/catalogue');
                } else {
                    navigate('/admin/home');
                }
            }, 100);

        } catch (error: any) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur serveur',
                text: 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.',
            });
        }
    };

    return (
        <div className="w-full flex flex-col lg:flex-row min-h-screen">
            {/* Section Slider - Côté Gauche */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50 z-10"></div>

                {/* Images du slider */}
                <div className="relative w-full h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Contenu du slider */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center text-white px-8">
                        <div className="mb-6 flex justify-center">
                            {slides[currentSlide].icon}
                        </div>
                        <h2 className="text-4xl font-bold mb-4">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            {slides[currentSlide].subtitle}
                        </p>
                        <div className="flex justify-center space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Section Formulaire - Côté Droit */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4 lg:p-8">
                <div className="w-full max-w-md mx-2 lg:mx-0">
                    {/* Logo et titre */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center mb-4">
                            <img src="/images/logob.png" alt="Logo" className="h-12 w-auto" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Terminal d'Échanges</h1>
                        <p className="text-gray-600 mt-2">
                            Connectez-vous à votre compte
                        </p>
                    </div>

                    {/* Formulaire de connexion */}
                    <Card className="shadow-lg border-0">
                        <Form
                            name="login_form"
                            initialValues={{ remember: true }}
                            onFinish={handleLogin}
                        >
                            <div className="space-y-6">
                                <Form.Item
                                    name="email"
                                    rules={[{ required: true, message: 'Veuillez entrer votre raison sociale!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Raison sociale"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Veuillez entrer votre mot de passe!' }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Mot de passe"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>

                                <div className="flex justify-between items-center">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Se souvenir de moi</Checkbox>
                                    </Form.Item>
                                    <a href="#" className="text-blue-600 hover:text-blue-800">
                                        Mot de passe oublié?
                                    </a>
                                </div>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoading}
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
                                    >
                                        Se connecter
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>

                        <Divider>ou</Divider>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Pas encore de compte?{' '}
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Créer un compte
                                </button>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;