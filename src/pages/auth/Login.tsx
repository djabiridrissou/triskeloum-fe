// src/components/auth/LoginComponent.tsx
import { useState, useEffect, JSX } from "react";
import { Button, Input, Card, Form, Checkbox, Divider } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Shield } from "lucide-react";
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
    const { setCartItems, cartItems } = useCartContext();

    const { data: cartData, isSuccess: cartSuccess } = useGetUserCartQuery(userId, {
        skip: !userId,
    });

    console.log('Cart Data:', cartData);

    useEffect(() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('currency');
        localStorage.removeItem('ressource');
        localStorage.removeItem('feeAmount');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        
        dispatch(api.util.invalidateTags(['User']));
    }, [dispatch]);

    useEffect(() => {
        if (cartSuccess && cartData?.success && cartData?.data) {
            const serverCartItems = cartData.data.items || [];
            
            const formattedServerItems = formatServerCartItems(serverCartItems);
            const localCartItems = cartItems;
            const mergedCart = mergeCartItems(localCartItems, formattedServerItems);
            
            setCartItems(mergedCart);
        }
    }, [cartSuccess, cartData, setCartItems]);

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
            image: "/images/A2.jpg",
            title: "",
            subtitle: "",
            icon: <Users className="w-8 h-8 text-blue-400" />
        },
        {
            image: "/images/A4k.jpg",
            title: "",
            subtitle: "",
            icon: <TrendingUp className="w-8 h-8 text-green-400" />
        },
        {
            image: "/images/A5k.jpg",
            title: "",
            subtitle: "",
            icon: <Shield className="w-8 h-8 text-purple-400" />
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
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

            const response = result.data;

            dispatch(api.util.invalidateTags(['User']));
            const userRole = response.data.isBuyer
                ? 'buyer'
                : response.data.isRepresentative
                    ? 'supplier'
                    : 'admin';

            localStorage.setItem('userEmail', response.data.email);
            localStorage.setItem('userId', response.data._id);
            localStorage.setItem('userName', response.data.socialReason || response.data.name);
            localStorage.setItem('userRole', userRole);

            setUserId(response.data._id);

            Swal.fire({
                icon: 'success',
                title: 'Connexion réussie',
                text: response.message || 'Vous êtes connecté avec succès.',
                timer: 2000,
                showConfirmButton: false,
            });

            console.log('Navigating to user dashboard: ', userRole);
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
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="absolute inset-0 bg-black/30 z-10"></div>

                {/* Images du slider */}
                <div className="relative w-full h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                index === currentSlide 
                                    ? 'opacity-100 scale-100' 
                                    : 'opacity-0 scale-105'
                            }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/placeholder-business.jpg";
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Contenu du slider */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="text-center text-white px-8 max-w-lg">
                        <div className="mb-6 flex justify-center transform transition-transform duration-500 hover:scale-110">
                            {slides[currentSlide].icon}
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                            {slides[currentSlide].subtitle}
                        </p>
                        
                        {/* Indicateurs de slide */}
                        <div className="flex justify-center space-x-3">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentSlide 
                                            ? 'bg-white scale-125' 
                                            : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Boutons de navigation */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
                    aria-label="Slide précédent"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
                    aria-label="Slide suivant"
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
                            <img 
                                src="/images/logob.png" 
                                alt="Logo Terminal d'Échanges" 
                                className="h-12 w-auto"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/logo-placeholder.png";
                                }}
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terminal d'Échanges</h1>
                        <p className="text-gray-600">
                            Connectez-vous à votre espace professionnel
                        </p>
                    </div>

                    {/* Formulaire de connexion */}
                    <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                        <div className="p-6">
                            <Form
                                name="login_form"
                                initialValues={{ remember: true }}
                                onFinish={handleLogin}
                                layout="vertical"
                            >
                                <div className="space-y-6">
                                    <Form.Item
                                        label="Raison sociale"
                                        name="email"
                                        rules={[{ 
                                            required: true, 
                                            message: 'Veuillez entrer votre raison sociale!' 
                                        }]}
                                    >
                                        <Input
                                            prefix={<UserOutlined className="text-gray-400" />}
                                            placeholder="Entrez votre raison sociale"
                                            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mot de passe"
                                        name="password"
                                        rules={[{ 
                                            required: true, 
                                            message: 'Veuillez entrer votre mot de passe!' 
                                        }]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined className="text-gray-400" />}
                                            placeholder="Entrez votre mot de passe"
                                            className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <div className="flex justify-between items-center">
                                        <Form.Item name="remember" valuePropName="checked" noStyle>
                                            <Checkbox className="text-gray-600">
                                                Se souvenir de moi
                                            </Checkbox>
                                        </Form.Item>
                                        <a 
                                            href="#" 
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            Mot de passe oublié?
                                        </a>
                                    </div>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoading}
                                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300"
                                        >
                                            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>

                            <Divider className="my-6">ou</Divider>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    Pas encore de compte?{' '}
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                                    >
                                        Créer un compte
                                    </button>
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Footer avec informations supplémentaires */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>Plateforme sécurisée pour vos échanges B2B</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;