import { useState, useEffect } from "react";
import { Button, Input, Card, Form, Checkbox, Divider, Select, DatePicker, Steps, Upload } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    IdcardOutlined,
    HomeOutlined,
    CalendarOutlined,
    ExclamationCircleOutlined,
    InboxOutlined
} from "@ant-design/icons";
import { ChevronLeft, ChevronRight, Users, TrendingUp, Shield, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { useLoginMutation } from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { countries } from "countries-list";
import emojiFlags from "emoji-flags";

const { Option } = Select;
const { Step } = Steps;

const AuthComponent = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
    const [userType, setUserType] = useState<'fournisseur-national' | 'fournisseur-international' | 'revendeur' | ''>('');
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);

    const countryList = Object.entries(countries).map(([code, country]) => ({
        code,
        name: country.name,
        emoji: emojiFlags.countryCode(code)?.emoji || "🏳️"
    }));

    const slides = [
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

    // Ajouter en haut du composant :
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                form.setFieldsValue({
                    // Réinitialiser certains champs si nécessaire
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleLogin = (values: { email: string; password: string }) => {
        const credentials = {
            email: values.email,
            password: values.password
        };

        login(credentials)
            .unwrap()
            .then((response) => {
                if (response.status === 407) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Compte non actif',
                        text: response.message || 'Votre compte a été désactivé. Veuillez contacter le support.',
                    });
                    navigate('/fees');
                    return;
                }
                if (response.status === 408) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Compte inactif',
                        text: response.message || 'Votre compte a été suspendu. Veuillez contacter le support.',
                    });
                    navigate('/change-password');
                    return;
                }
                Swal.fire({
                    icon: 'success',
                    title: 'Connexion réussie',
                    text: response.message || 'Vous êtes connecté avec succès.',
                    timer: 3000,
                    showConfirmButton: false,
                });

                let userRole = response.data.isBuyer ? 'buyer' : response.data.isRepresentative ? 'seller' : 'admin';

                localStorage.setItem('userEmail', JSON.stringify(response.data.email));
                localStorage.setItem('userId', JSON.stringify(response.data._id));
                localStorage.setItem('userName', JSON.stringify(response.data.name));
                localStorage.setItem('userRole', JSON.stringify(userRole));
                if (userRole === 'buyer') {
                    navigate('/buyer/dashboard');
                } else if (userRole === 'seller') {
                    navigate('/seller/dashboard');
                } else {
                    navigate('/admin/dashboard');
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de connexion',
                    text: error?.data?.error || 'Email ou mot de passe incorrect.',
                });
            });
    };

    const handleRegister = (values: any) => {
        console.log('Register values:', values);
        toast.success("Inscription réussie !");
    };

    const getUserTypeLabel = (type: any) => {
        switch (type) {
            case 'fournisseur-national': return 'Fournisseur National (50.000 FCFA)';
            case 'fournisseur-international': return 'Fournisseur International (100.000 FCFA)';
            case 'revendeur': return 'Revendeur/Distributeur (20.000 FCFA)';
            default: return 'Sélectionnez votre type';
        }
    };

    // Réinitialiser le formulaire quand le type d'utilisateur change
    useEffect(() => {
        form.resetFields();
        setCurrentStep(0);
    }, [userType, form]);

    const generateRandomData = () => {
        const randomString = (length: number) => Math.random().toString(36).substring(2, length + 2);
        const randomNumber = (length: number) => Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
        const randomEmail = () => `${randomString(8)}@${randomString(5)}.com`;
        const randomPhone = () => `+2289${randomNumber(7)}`;
        const randomDate = () => {
            const start = new Date(1970, 0, 1);
            const end = new Date(2000, 0, 1);
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };

        const commonData = {
            name: `Entreprise ${randomString(5)}`,
            rccmNumber: `RCCM${randomNumber(5)}`,
            nifNumber: `NIF${randomNumber(5)}`,
            country: ['TG', 'BJ', 'CI', 'SN', 'FR', 'US'][Math.floor(Math.random() * 6)],
            address: `${randomNumber(3)} Rue ${randomString(8)}, ${randomString(5)}`,
            phoneNumber: randomPhone(),
            email: randomEmail(),
            password: 'password123',
            confirmPassword: 'password123',
        };

        if (userType === 'revendeur') {
            return {
                ...commonData,
                fullName: `Utilisateur ${randomString(8)}`,
                socialReason: `SARL ${randomString(6)}`,
                cniNumber: `CNI${randomNumber(8)}`,
                birthDate: randomDate(),
            };
        }

        if (userType === 'fournisseur-national' || userType === 'fournisseur-international') {
            return {
                ...commonData,
                representativeName: `Représentant ${randomString(8)}`,
                representativeBirthDate: randomDate(),
                representativeBirthPlace: `Lieu ${randomString(6)}`,
                representativeIdType: ['CNI', 'PASSPORT', 'PERMIS'][Math.floor(Math.random() * 3)],
                representativeIdNumber: `ID${randomNumber(8)}`,
            };
        }

        return commonData;
    };

    const fillRandomData = () => {
        const randomData = generateRandomData();
        form.setFieldsValue(randomData);
        toast.success('Données aléatoires générées !');
    };

    const nextStep = () => {
        // Valider les champs du step actuel avant de passer au suivant
        const fields = getStepFields(currentStep);
        form.validateFields(fields)
            .then(() => {
                setCurrentStep(currentStep + 1);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const getStepFields = (step: number) => {
        switch (step) {
            case 0: // Informations de base
                if (userType === 'revendeur') {
                    return ['fullName', 'socialReason', 'rccmNumber', 'nifNumber', 'cniNumber'];
                } else {
                    return ['name', 'rccmNumber', 'nifNumber'];
                }
            case 1: // Localisation et contact
                return ['country', 'address', 'phoneNumber', 'email'];
            case 2: // Informations supplémentaires
                if (userType === 'fournisseur-national' || userType === 'fournisseur-international') {
                    return ['representativeName', 'representativeBirthDate', 'representativeBirthPlace', 'representativeIdType', 'representativeIdNumber'];
                } else if (userType === 'revendeur') {
                    return ['birthDate'];
                }
                return [];
            case 3: // Mot de passe
                return ['password', 'confirmPassword'];
            default:
                return [];
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Informations de base
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        {userType === 'revendeur' ? (
                            <>
                                <Form.Item
                                    name="fullName"
                                    label="Nom complet"
                                    rules={[{ required: true, message: 'Veuillez entrer votre nom complet!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Nom complet"
                                        className="rounded-lg"
                                        size='large'
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="socialReason"
                                    label="Raison sociale"
                                    rules={[{ required: true, message: 'Veuillez entrer votre raison sociale!' }]}
                                >
                                    <Input
                                        prefix={<BankOutlined />}
                                        placeholder="Raison sociale"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>
                            </>
                        ) : (
                            <Form.Item
                                name="name"
                                label={userType as 'revendeur' | 'fournisseur-national' | 'fournisseur-international' | '' === 'revendeur' ? 'Nom complet' : 'Nom de l\'entreprise'}
                                rules={[{ required: true, message: 'Ce champ est obligatoire!' }]}
                            >
                                <Input
                                    prefix={userType as 'revendeur' | 'fournisseur-national' | 'fournisseur-international' | '' === 'revendeur' ? <UserOutlined /> : <BankOutlined />}
                                    placeholder={userType as 'revendeur' | 'fournisseur-national' | 'fournisseur-international' | '' === 'revendeur' ? 'Nom complet' : 'Nom de l\'entreprise'}
                                    className="rounded-lg"
                                    size="large"
                                />
                            </Form.Item>
                        )}

                        <div className="grid grid-rows-2 gap-4">
                            <Form.Item
                                name="rccmNumber"
                                label="N° RCCM"
                                rules={[{ required: true, message: 'Veuillez entrer votre numéro RCCM!' }]}
                            >
                                <Input
                                    prefix={<IdcardOutlined />}
                                    placeholder="N° RCCM"
                                    className="rounded-lg"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="nifNumber"
                                label="N° NIF"
                                rules={[{ required: true, message: 'Veuillez entrer votre numéro NIF!' }]}
                            >
                                <Input
                                    prefix={<IdcardOutlined />}
                                    placeholder="N° NIF"
                                    className="rounded-lg"
                                    size="large"
                                />
                            </Form.Item>
                        </div>

                        {userType === 'revendeur' && (
                            <Form.Item
                                name="cniNumber"
                                label="N° CNI"
                                rules={[{ required: true, message: 'Veuillez entrer votre numéro CNI!' }]}
                            >
                                <Input
                                    prefix={<IdcardOutlined />}
                                    placeholder="N° CNI"
                                    className="rounded-lg"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    </div>
                );
            case 1: // Localisation et contact
                return (
                    <div className="space-y-4">
                        <Form.Item
                            name="country"
                            label="Pays"
                            initialValue={userType === 'fournisseur-national' || userType === 'revendeur' ? 'TG' : undefined}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input: any, option: any) => {
                                    if (option) {
                                        return option.children?.toLowerCase().includes(input.toLowerCase());
                                    }
                                    return false;
                                }}
                                disabled={userType === 'fournisseur-national' || userType === 'revendeur'}
                                size="large"
                                className="w-full"
                            >
                                {countryList.map(country => (
                                    <Option key={country.code} value={country.code}>
                                        <div className="flex items-center">
                                            <span className="mr-2">{country.emoji}</span>
                                            {country.name}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Adresse"
                            rules={[{ required: true, message: 'Veuillez entrer votre adresse!' }]}
                        >
                            <Input
                                prefix={<HomeOutlined />}
                                placeholder="Adresse complète"
                                className="rounded-lg"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phoneNumber"
                            label="Téléphone"
                            rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone!' }]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="Téléphone"
                                className="rounded-lg"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Veuillez entrer votre email!' },
                                { type: 'email', message: 'Email invalide!' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="Email"
                                className="rounded-lg"
                                size="large"
                            />
                        </Form.Item>
                    </div>
                );
            case 2: // Informations supplémentaires
                if (userType === 'fournisseur-national' || userType === 'fournisseur-international') {
                    return (
                        <div className="space-y-4">
                            <Divider orientation="left">Représentant légal</Divider>

                            <Form.Item
                                name="representativeName"
                                label="Nom complet"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du représentant!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Nom complet du représentant"
                                    className="rounded-lg"
                                    size="large"
                                />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="representativeBirthDate"
                                    label="Date de naissance"
                                    rules={[{ required: true, message: 'Veuillez entrer la date de naissance!' }]}
                                >
                                    <DatePicker
                                        placeholder="Date de naissance"
                                        className="w-full rounded-lg"
                                        size="large"
                                        format="DD/MM/YYYY"
                                        suffixIcon={<CalendarOutlined />}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="representativeBirthPlace"
                                    label="Lieu de naissance"
                                    rules={[{ required: true, message: 'Veuillez entrer le lieu de naissance!' }]}
                                >
                                    <Input
                                        placeholder="Lieu de naissance"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    name="representativeIdType"
                                    label="Type de pièce"
                                    rules={[{ required: true, message: 'Veuillez sélectionner le type de pièce!' }]}
                                >
                                    <Select placeholder="Type de pièce" size="large">
                                        <Option value="CNI">CNI</Option>
                                        <Option value="PASSPORT">Passeport</Option>
                                        <Option value="PERMIS">Permis de conduire</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="representativeIdNumber"
                                    label="N° de pièce"
                                    rules={[{ required: true, message: 'Veuillez entrer le numéro de pièce!' }]}
                                >
                                    <Input
                                        placeholder="N° de pièce"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    );
                } else if (userType === 'revendeur') {
                    return (
                        <div className="space-y-4">
                            <Form.Item
                                name="birthDate"
                                label="Date de naissance"
                                rules={[{ required: true, message: 'Veuillez entrer votre date de naissance!' }]}
                            >
                                <DatePicker
                                    placeholder="Date de naissance"
                                    className="w-full rounded-lg"
                                    size="large"
                                    format="DD/MM/YYYY"
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>

                            <Form.Item
                                name="currency"
                                label="Devise"
                                initialValue={
                                    userType as 'revendeur' | 'fournisseur-national' | 'fournisseur-international' | '' === 'fournisseur-international' ? 'USD' :
                                        (userType as 'revendeur' | 'fournisseur-national' | 'fournisseur-international' | '' === 'fournisseur-national' || userType === 'revendeur') ? 'XOF' : undefined
                                }
                            >
                                <Select disabled size="large">
                                    <Option value="XOF">FCFA (XOF)</Option>
                                    <Option value="USD">Dollar américain (USD)</Option>
                                </Select>
                            </Form.Item>
                        </div>
                    );
                }
                return null;
            // Modifier la fonction renderStepContent pour l'étape 3
            case 3: // Upload des pièces d'identité
                return (
                    <div className="space-y-4">
                        <Divider orientation="left">Pièces d'identité</Divider>

                        <Form.Item
                            name="idFront"
                            label="Recto de la pièce d'identité"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                            rules={[{ required: true, message: 'Le recto de la pièce est obligatoire!' }]}
                        >
                            <Upload.Dragger
                                name="idFront"
                                action="/api/upload"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false} // Pour gérer l'upload manuellement
                                accept="image/*,.pdf"
                                className="min-h-[120px] sm:min-h-[180px]"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Cliquez ou glissez-déposez le recto de la pièce</p>
                                <p className="ant-upload-hint">Formats acceptés: JPG, PNG, PDF</p>
                            </Upload.Dragger>
                        </Form.Item>

                        <Form.Item
                            name="idBack"
                            label="Verso de la pièce d'identité"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList}
                            rules={[{ required: true, message: 'Le verso de la pièce est obligatoire!' }]}
                        >
                            <Upload.Dragger
                                name="idBack"
                                action="/api/upload"
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false} // Pour gérer l'upload manuellement
                                accept="image/*,.pdf"
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Cliquez ou glissez-déposez le verso de la pièce</p>
                                <p className="ant-upload-hint">Formats acceptés: JPG, PNG, PDF</p>
                            </Upload.Dragger>
                        </Form.Item>

                        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200 text-xs sm:text-sm">
                            <ExclamationCircleOutlined className="mr-2" />
                            Les pièces doivent être clairement visibles...
                        </div>
                    </div>
                )
            default:
                return null;
        }
    };

    const getSteps = () => {
        const steps = [
            { title: '----' },
            { title: '----' },
        ];

        if (userType === 'fournisseur-national' || userType === 'fournisseur-international' || userType === 'revendeur') {
            steps.push({ title: '----' });
        }

        steps.push({ title: '' });

        return steps;
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
                            {authMode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
                        </p>
                    </div>

                    {/* Formulaire de connexion */}
                    {authMode === 'login' && (
                        <Card className="shadow-lg border-0">
                            <Form
                                name="login_form"
                                initialValues={{ remember: true }}
                                onFinish={handleLogin}
                            >
                                <div className="space-y-6">
                                    <Form.Item
                                        name="email"
                                        rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="Email"
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
                                        onClick={() => setAuthMode('register')}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        Créer un compte
                                    </button>
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Formulaire d'inscription */}
                    {authMode === 'register' && (
                        <Card className="shadow-lg border-0">
                            {/* Sélection du type d'utilisateur */}
                            {!userType && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-center mb-6">
                                        Choisissez votre type de compte
                                    </h3>

                                    <button
                                        onClick={() => setUserType('fournisseur-national')}
                                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-colors text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Fournisseur National</h4>
                                                <p className="text-sm text-gray-600">Pour les fournisseurs locaux</p>
                                            </div>
                                            <div className="text-blue-600 font-bold">50.000 FCFA</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setUserType('fournisseur-international')}
                                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-colors text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Fournisseur International</h4>
                                                <p className="text-sm text-gray-600">Pour les fournisseurs internationaux</p>
                                            </div>
                                            <div className="text-blue-600 font-bold">100.000 FCFA</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setUserType('revendeur')}
                                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-colors text-left"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Revendeur/Distributeur</h4>
                                                <p className="text-sm text-gray-600">Pour les revendeurs et distributeurs</p>
                                            </div>
                                            <div className="text-blue-600 font-bold">20.000 FCFA</div>
                                        </div>
                                    </button>

                                    <div className="text-center mt-6">
                                        <button
                                            onClick={() => setAuthMode('login')}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ← Retour à la connexion
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Formulaire d'inscription multi-step */}
                            {userType && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold">
                                            {getUserTypeLabel(userType)}
                                        </h3>
                                        <button
                                            onClick={() => setUserType('')}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Changer
                                        </button>
                                    </div>

                                    <div className="steps-responsive-wrapper">
                                        <Steps
                                            current={currentStep}
                                            size="small"
                                            className="mb-2"
                                        >
                                            {getSteps().map((step, index) => (
                                                <Step key={index} title={step.title} />
                                            ))}
                                        </Steps>
                                    </div>


                                    {authMode === 'register' && userType && (
                                        <div className="text-right mb-2">
                                            <Button
                                                size="small"
                                                type="text"
                                                onClick={fillRandomData}
                                                className="text-xs text-gray-500 hover:text-blue-500"
                                            >
                                                [DEV] Remplir automatiquement
                                            </Button>
                                        </div>
                                    )}
                                    <Form
                                        form={form}
                                        name="register_form"
                                        onFinish={handleRegister}
                                        layout="vertical"
                                    >
                                        {renderStepContent()}

                                        <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4">
                                            {currentStep > 0 ? (
                                                <Button
                                                    onClick={prevStep}
                                                    className="h-12 rounded-lg text-lg font-semibold"
                                                >
                                                    Précédent
                                                </Button>
                                            ) : (
                                                <div></div> // Empty div to maintain space
                                            )}

                                            {currentStep < getSteps().length - 1 ? (
                                                <Button
                                                    type="primary"
                                                    onClick={nextStep}
                                                    className="h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
                                                >
                                                    Suivant
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="w h-12 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
                                                >
                                                    Valider
                                                </Button>
                                            )}
                                        </div>
                                    </Form>

                                    <div className="text-center mt-6">
                                        <p className="text-gray-600">
                                            Déjà un compte?{' '}
                                            <button
                                                onClick={() => setAuthMode('login')}
                                                className="text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                Se connecter
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                    {authMode === 'register' && (
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Moyens de paiement acceptés</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                                <div>• Mixx by Yas: 90291421</div>
                                <div>• Flooz: 98042314</div>
                                <div>• NSIA Banque: 260081527014</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthComponent;