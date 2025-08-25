import { useState, useEffect } from "react";
import { Button, Input, Card, Form, Divider, Select, DatePicker, Upload, Tooltip, Modal } from "antd";
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    BankOutlined,
    IdcardOutlined,
    HomeOutlined,
    CalendarOutlined,
    ExclamationCircleOutlined,
    InboxOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import toast from "react-hot-toast";
import { countries } from "countries-list";
import emojiFlags from "emoji-flags";
import { ChevronLeft, ChevronRight, Globe, Shield, TrendingUp } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';

const { Option } = Select;
const { TextArea } = Input;

const Register = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [userType, setUserType] = useState('');
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [messageText, setMessageText] = useState('');
    const location = useLocation();
    const [senderInfo, setSenderInfo] = useState({ name: '', email: '', phone: '' });
    const [isSending, setIsSending] = useState(false);
    const navigate = useNavigate();

    const getDefaultMessage = (type: any) => {
        switch (type) {
            case 'fournisseur':
                return `Bonjour,\n\nJe souhaite devenir partenaire fournisseur sur Terminal d'Échanges.\n\nType de fournisseur: National/International\n\nMerci de me contacter pour les prochaines étapes.\n\nCordialement`;
            case 'representant':
                return `Bonjour,\n\nJe souhaite devenir représentant sur Terminal d'Échanges.\n\nType de représentation: Régional/National\n\nMerci de me contacter pour les prochaines étapes.\n\nCordialement`;
            default:
                return '';
        }
    };

    const showModal = (type: any) => {
        setModalType(type);
        setMessageText(getDefaultMessage(type));
        setSenderInfo({ name: '', email: '', phone: '' });
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        if (!senderInfo.name || !senderInfo.email || !senderInfo.phone || !messageText) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsSending(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/contact/new`, {
                name: senderInfo.name,
                email: senderInfo.email,
                phone: senderInfo.phone,
                message: `Type de demande: ${modalType === 'fournisseur' ? 'Partenaire Fournisseur' : 'Représentant'}\n\n${messageText}`
            });

            toast.success('Votre demande a été envoyée avec succès');
            setIsModalVisible(false);
            setMessageText('');
            setSenderInfo({ name: '', email: '', phone: '' });
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            toast.error('Une erreur est survenue lors de l\'envoi de votre demande');
        } finally {
            setIsSending(false);
        }
    };



    const handleModalCancel = () => {
        setIsModalVisible(false);
        setMessageText('');
    };

    useEffect(() => {
        const hash = location.hash;
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        const step = params.get('step');

        if (type && ['fournisseur-national', 'fournisseur-international', 'revendeur'].includes(type)) {
            setUserType(type);
            if (step && !isNaN(parseInt(step))) {
                const stepNumber = parseInt(step);
                if (stepNumber >= 0 && stepNumber <= 4) {
                    setCurrentStep(stepNumber);
                }
            }
        }

        if (hash) {
            switch (hash) {
                case '#fournisseur-national':
                    setUserType('fournisseur-national');
                    break;
                case '#fournisseur-international':
                    setUserType('fournisseur-international');
                    break;
                case '#revendeur':
                    setUserType('revendeur');
                    break;
                case '#informations-base':
                    if (userType) setCurrentStep(0);
                    break;
                case '#contact':
                    if (userType) setCurrentStep(1);
                    break;
                case '#details':
                    if (userType) setCurrentStep(2);
                    break;
                case '#documents':
                    if (userType) setCurrentStep(3);
                    break;
                case '#mot-de-passe':
                    if (userType) setCurrentStep(4);
                    break;
            }
        }
    }, [location, userType]);

    useEffect(() => {
        if (userType) {
            const searchParams = new URLSearchParams();
            searchParams.set('type', userType);
            searchParams.set('step', currentStep.toString());

            const newUrl = `${location.pathname}?${searchParams.toString()}`;
            window.history.replaceState(null, '', newUrl);
        }
    }, [userType, currentStep, location.pathname]);

    const countryList = Object.entries(countries).map(([code, country]) => ({
        code,
        name: country.name,
        emoji: emojiFlags.countryCode(code)?.emoji || "🏳️"
    }));

    const slides = [
        {
            image: "/images/A2.jpg",
            title: "",
            subtitle: "",
            icon: <Globe className="w-8 h-8 text-blue-400" />
        },
        {
            image: "/images/A4k.jpg",
            title: "",
            subtitle: "",
            icon: <Shield className="w-8 h-8 text-green-400" />
        },
        {
            image: "/images/A5k.jpg",
            title: "",
            subtitle: "",
            icon: <TrendingUp className="w-8 h-8 text-purple-400" />
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

    const saveFormData = () => {
        const currentValues = form.getFieldsValue();
        setFormData(prevData => ({
            ...prevData,
            ...currentValues
        }));
        console.log("Données sauvegardées:", { ...formData, ...currentValues });
    };

    const restoreFormData = () => {
        if (Object.keys(formData).length > 0) {
            form.setFieldsValue(formData);
        }
    };

    const handleRegister = async (values: any) => {
        setLoading(true);
        try {
            const allData = { ...formData, ...values };

            const formDataToSend = new FormData();
            if (allData.idFront?.[0]?.originFileObj) {
                formDataToSend.append('idFront', allData.idFront[0].originFileObj);
            }
            if (allData.idBack?.[0]?.originFileObj) {
                formDataToSend.append('idBack', allData.idBack[0].originFileObj);
            }
            if (allData.witnIdFront?.[0]?.originFileObj) {
                formDataToSend.append('witnIdFront', allData.witnIdFront[0].originFileObj);
            }
            if (allData.witnIdBack?.[0]?.originFileObj) {
                formDataToSend.append('witnIdBack', allData.witnIdBack[0].originFileObj);
            }
            if (allData.shopMap?.[0]?.originFileObj) {
                formDataToSend.append('shopMap', allData.shopMap[0].originFileObj);
            }

            const appendIfDefined = (field: any, value: any) => {
                if (value !== undefined && value !== null && value !== '') {
                    formDataToSend.append(field, value);
                }
            };

            appendIfDefined('password', allData.password);
            if (userType === 'revendeur') {
                appendIfDefined('fullName', allData.fullName);
                appendIfDefined('socialReason', allData.socialReason);
                appendIfDefined('rccmNumber', allData.rccmNumber);
                appendIfDefined('nifNumber', allData.nifNumber);
                appendIfDefined('cniNumber', allData.cniNumber);
                appendIfDefined('country', allData.country);
                appendIfDefined('address', allData.address);
                appendIfDefined('phoneNumber', allData.phoneNumber);
                appendIfDefined('email', allData.email);
                if (allData.birthDate) {
                    appendIfDefined('birthDate', allData.birthDate.format('YYYY-MM-DD'));
                }
                appendIfDefined('currency', allData.currency || 'XOF');
                appendIfDefined('shopAddress', allData.shopAddress);
                appendIfDefined('witnessName', allData.witnessName);
                appendIfDefined('witnessPhone', allData.witnessPhone);

                await axios.post(`${import.meta.env.VITE_BASE_URL}/buyer/create`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
            } else {
                appendIfDefined('name', allData.name);
                appendIfDefined('socialReason', allData.socialReason);
                appendIfDefined('rccmNumber', allData.rccmNumber);
                appendIfDefined('nifNumber', allData.nifNumber);
                appendIfDefined('country', allData.country);
                appendIfDefined('representativeName', allData.representativeName);
                if (allData.representativeBirthDate) {
                    appendIfDefined('representativeBirthDate', allData.representativeBirthDate.format('YYYY-MM-DD'));
                }
                appendIfDefined('representativeBirthPlace', allData.representativeBirthPlace);
                appendIfDefined('representativeIdType', allData.representativeIdType);
                appendIfDefined('representativeIdNumber', allData.representativeIdNumber);
                appendIfDefined('currency', allData.currency || 'XOF');
                appendIfDefined('email', allData.email);
                appendIfDefined('phoneNumber', allData.phoneNumber);
                appendIfDefined('address', allData.address);
                appendIfDefined('witnessName', allData.witnessName);
                appendIfDefined('witnessPhone', allData.witnessPhone);

                await axios.post(`${import.meta.env.VITE_BASE_URL}/supplier/create`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
            }

            await Swal.fire({
                title: 'Inscription réussie!',
                text: 'Compte créé avec succès.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            navigate('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            await Swal.fire({
                title: 'Erreur',
                text: error?.response?.data?.error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const getUserTypeLabel = (type: any) => {
        switch (type) {
            case 'fournisseur-national': return 'Fournisseur National (50.000 FCFA)';
            case 'fournisseur-international': return 'Fournisseur International (100.000 FCFA)';
            case 'revendeur': return 'Vendeur (20.000 FCFA)';
            default: return 'Sélectionnez votre type';
        }
    };

    useEffect(() => {
        form.resetFields();
        setFormData({});
        setCurrentStep(0);
    }, [userType, form]);

    const generateRandomData = () => {
        const randomString = (length: any) => Math.random().toString(36).substring(2, length + 2);
        const randomNumber = (length: any) => Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
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
            witnessName: `Témoin ${randomString(6)}`,
            witnessPhone: randomPhone(),
        };

        if (userType === 'revendeur') {
            return {
                ...commonData,
                fullName: `Utilisateur ${randomString(8)}`,
                socialReason: `SARL ${randomString(6)}`,
                cniNumber: `CNI${randomNumber(8)}`,
                birthDate: randomDate(),
                shopAddress: `${randomNumber(3)} Avenue ${randomString(8)}, ${randomString(5)}`,
            };
        }

        if (userType === 'fournisseur-national' || userType === 'fournisseur-international') {
            return {
                ...commonData,
                socialReason: `SARL ${randomString(6)}`,
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
        setFormData(randomData);
        toast.success('Données aléatoires générées !');
    };

    const nextStep = () => {
        const fields = getStepFields(currentStep);
        form.validateFields(fields)
            .then(() => {
                saveFormData();
                const newStep = currentStep + 1;
                setCurrentStep(newStep);
                navigate(`/register?type=${userType}&step=${newStep}`);
            })
            .catch((error) => {
                console.log('Validation error:', error);
            });
    };

    const prevStep = () => {
        saveFormData();
        const newStep = currentStep - 1;
        setCurrentStep(newStep);
        navigate(`/register?type=${userType}&step=${newStep}`);
    };

    // Restaurer les données quand on change d'étape
    useEffect(() => {
        if (currentStep > 0) {
            restoreFormData();
        }
    }, [currentStep]);

    const getStepFields = (step: any) => {
        switch (step) {
            case 0: // Informations de base
                if (userType === 'revendeur') {
                    return ['fullName', 'socialReason', 'rccmNumber', 'nifNumber', 'cniNumber'];
                } else {
                    return ['name', 'socialReason', 'rccmNumber', 'nifNumber'];
                }
            case 1: // Localisation et contact
                return ['country', 'address', 'phoneNumber', 'email'];
            case 2: // Informations supplémentaires
                if (userType === 'fournisseur-national' || userType === 'fournisseur-international') {
                    return ['representativeName', 'representativeBirthDate', 'representativeBirthPlace', 'representativeIdType', 'representativeIdNumber'];
                } else if (userType === 'revendeur') {
                    return ['birthDate', 'shopAddress'];
                }
                return [];
            case 3: // Témoin et documents
                return ['witnessName', 'witnessPhone', 'idFront', 'idBack', 'witnIdFront', 'witnIdBack'];
            case 4: // Mot de passe
                return ['password', 'confirmPassword'];
            default:
                return [];
        }
    };

    const getStepTitle = (step: any) => {
        switch (step) {
            case 0: return 'Informations de base';
            case 1: return 'Contact';
            case 2: return 'Détails';
            case 3: return 'Documents';
            case 4: return 'Mot de passe';
            default: return '';
        }
    };

    const getSteps = () => {
        const steps = [
            { title: 'Informations de base', key: 0 },
            { title: 'Contact', key: 1 },
        ];

        if (userType === 'fournisseur-national' || userType === 'fournisseur-international' || userType === 'revendeur') {
            steps.push({ title: 'Détails', key: 2 });
        }

        steps.push(
            { title: 'Documents', key: steps.length },
            { title: 'Mot de passe', key: steps.length + 1 }
        );

        return steps;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Informations de base
                return (
                    <div className="space-y-4">
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
                            <>
                                <Form.Item
                                    name="name"
                                    label="Nom de l'entreprise"
                                    rules={[{ required: true, message: 'Ce champ est obligatoire!' }]}
                                >
                                    <Input
                                        prefix={<BankOutlined />}
                                        placeholder="Nom de l'entreprise"
                                        className="rounded-lg"
                                        size="large"
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
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            rules={[{ required: true, message: 'Veuillez sélectionner un pays!' }]}
                            initialValue={userType === 'fournisseur-national' || userType === 'revendeur' ? 'TG' : undefined}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) => {
                                    if (option && option.children) {
                                        return option.children.toString().toLowerCase().includes(input.toLowerCase());
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
                            label="Adresse personnelle"
                            rules={[{ required: true, message: 'Veuillez entrer votre adresse!' }]}
                        >
                            <Input
                                prefix={<HomeOutlined />}
                                placeholder="Adresse complète"
                                className="rounded-lg"
                                size="large"
                            />
                        </Form.Item>

                        {userType === 'revendeur' && (
                            <Form.Item
                                name="shopAddress"
                                label="Adresse de la boutique"
                                rules={[{ required: true, message: 'Veuillez entrer l\'adresse de votre boutique!' }]}
                            >
                                <Input
                                    prefix={<HomeOutlined />}
                                    placeholder="Adresse de la boutique"
                                    className="rounded-lg"
                                    size="large"
                                />
                            </Form.Item>
                        )}

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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    name="representativeIdType"
                                    label="Type de pièce"
                                    rules={[{ required: true, message: 'Veuillez sélectionner le type de pièce!' }]}
                                >
                                    <Select placeholder="Type de pièce" size="large">
                                        <Option value="CNI">CNI</Option>
                                        <Option value="PASSEPORT">Passeport</Option>
                                        <Option value="PERMIS">Permis de conduire</Option>
                                        <Option value="CARTE_ELECTEUR">Carte d'électeur</Option>
                                        <Option value="CARTE_SEJOUR">Carte de sejour</Option>
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
                                initialValue="XOF"
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
            case 3: // Documents
                return (
                    <div className="space-y-6">
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
                                    beforeUpload={() => false}
                                    accept="image/*,.pdf"
                                    className="min-h-[120px] sm:min-h-[180px]"
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Déposez le recto de la pièce</p>
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
                                    beforeUpload={() => false}
                                    accept="image/*,.pdf"
                                    className="min-h-[120px] sm:min-h-[180px]"
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Déposez le verso de la pièce</p>
                                    <p className="ant-upload-hint">Formats acceptés: JPG, PNG, PDF</p>
                                </Upload.Dragger>
                            </Form.Item>
                        </div>

                        <div className="space-y-4">
                            <Divider orientation="left">
                                <div className="flex items-center">
                                    <span>Informations du témoin</span>
                                    <Tooltip title="Le témoin sert de garant pour les transactions à crédit. Il doit être une personne de confiance.">
                                        <InfoCircleOutlined className="ml-2 text-blue-500" />
                                    </Tooltip>
                                </div>
                            </Divider>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    name="witnessName"
                                    label="Nom du témoin"
                                    rules={[{ required: true, message: 'Veuillez entrer le nom du témoin!' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Nom du témoin"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="witnessPhone"
                                    label="Téléphone du témoin"
                                    rules={[{ required: true, message: 'Veuillez entrer le téléphone du témoin!' }]}
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="Téléphone du témoin"
                                        className="rounded-lg"
                                        size="large"
                                    />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    name="witnIdFront"
                                    label="Recto de la pièce du témoin"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                    rules={[{ required: true, message: 'Le recto de la pièce est obligatoire!' }]}
                                >
                                    <Upload.Dragger
                                        name="witnIdFront"
                                        action="/api/upload"
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        accept="image/*,.pdf"
                                        className="min-h-[120px] sm:min-h-[180px]"
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Déposez le recto de la pièce</p>
                                        <p className="ant-upload-hint">Formats acceptés: JPG, PNG, PDF</p>
                                    </Upload.Dragger>
                                </Form.Item>

                                <Form.Item
                                    name="witnIdBack"
                                    label="Verso de la pièce du témoin"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                    rules={[{ required: true, message: 'Le verso de la pièce est obligatoire!' }]}
                                >
                                    <Upload.Dragger
                                        name="witnIdBack"
                                        action="/api/upload"
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        accept="image/*,.pdf"
                                        className="min-h-[120px] sm:min-h-[180px]"
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Déposez le verso de la pièce</p>
                                        <p className="ant-upload-hint">Formats acceptés: JPG, PNG, PDF</p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </div>
                        </div>

                        {userType === 'revendeur' && (
                            <div className="space-y-4">
                                <Divider orientation="left">Localisation de la boutique</Divider>

                                <Form.Item
                                    name="shopMap"
                                    label="Photo de l'emplacement de la boutique"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => e.fileList}
                                    rules={[{ required: true, message: 'La photo de la boutique est obligatoire!' }]}
                                >
                                    <Upload.Dragger
                                        name="shopMap"
                                        action="/api/upload"
                                        listType="picture"
                                        maxCount={1}
                                        beforeUpload={() => false}
                                        accept="image/*"
                                        className="min-h-[120px] sm:min-h-[180px]"
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Déposez la photo de votre boutique</p>
                                        <p className="ant-upload-hint">Formats acceptés: JPG, PNG</p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </div>
                        )}

                        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200 text-xs sm:text-sm">
                            <ExclamationCircleOutlined className="mr-2" />
                            Tous les documents doivent être clairement visibles et lisibles.
                        </div>
                    </div>
                );
            case 4: // Mot de passe
                return (
                    <div className="space-y-4">
                        <Divider orientation="left">Création du mot de passe</Divider>

                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            rules={[
                                { required: true, message: 'Veuillez entrer un mot de passe!' },
                                { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères!' }
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                placeholder="Mot de passe"
                                className="rounded-lg"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirmer le mot de passe"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                { required: true, message: 'Veuillez confirmer votre mot de passe!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Les mots de passe ne correspondent pas!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="Confirmer le mot de passe"
                                className="rounded-lg"
                                size="large"
                            />
                        </Form.Item>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm">
                            <InfoCircleOutlined className="mr-2 text-blue-500" />
                            Votre mot de passe doit contenir au moins 8 caractères.
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderCustomSteps = () => {
        const steps = getSteps();
        return (
            <div className="mb-6">
                {/* Version desktop */}
                <div className="hidden sm:flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCurrentStep(index);
                                navigate(`/register?type=${userType}&step=${index}`);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${index < currentStep ? 'bg-green-500 text-white' :
                                index === currentStep ? 'bg-blue-500 text-white' :
                                    'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            {index < currentStep ? <CheckCircleOutlined /> : index + 1}
                        </button>
                    ))}
                </div>

                {/* Version mobile */}
                <div className="sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Étape {currentStep + 1} sur {steps.length}
                        </span>
                        <span className="text-sm text-blue-600 font-medium">
                            {getStepTitle(currentStep)}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        );
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
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-105'
                                }`}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/placeholder-registration.jpg";
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
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
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
            <div className="w-full lg:w-1/2 bg-gray-50 flex items-center justify-center p-2 lg:p-3">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
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
                        <p className="text-gray-600">Créez votre compte professionnel</p>
                    </div>

                    <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                        <div className="p-6">
                            {/* Sélection du type d'utilisateur */}
                            {!userType && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-center mb-6">
                                        Choisissez votre type de compte
                                    </h3>

                                    <button
                                        onClick={() => showModal('fournisseur')}
                                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-300 text-left hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Devenir Partenaire Fournisseur</h4>
                                                <p className="text-sm text-gray-600">Fournisseur de marchandise National/International</p>
                                            </div>
                                            <div className="text-blue-600 font-bold">→</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => showModal('representant')}
                                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-300 text-left hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Devenir Représentant</h4>
                                                <p className="text-sm text-gray-600">Représentant Régional/National</p>
                                            </div>
                                            <div className="text-blue-600 font-bold">→</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setUserType('revendeur')
                                            setCurrentStep(0);
                                            navigate('/register?type=revendeur&step=0');
                                        }}
                                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg transition-all duration-300 text-left hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Vendeur</h4>
                                                <p className="text-sm text-gray-600">Pour les revendeurs et distributeurs</p>
                                            </div>
                                            <div className="text-blue-600 font-bold">20.000 FCFA</div>
                                        </div>
                                    </button>

                                    <Divider>ou</Divider>

                                    <div className="text-center">
                                        <p className="text-gray-600">
                                            Déjà un compte?{' '}
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors hover:underline"
                                            >
                                                Se connecter
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Formulaire d'inscription multi-step */}
                            {userType && (
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                        <h3 className="text-lg font-semibold mb-2 sm:mb-0">
                                            {getUserTypeLabel(userType)}
                                        </h3>
                                        <button
                                            onClick={() => setUserType('')}
                                            className="text-blue-600 hover:text-blue-800 text-sm self-start sm:self-center transition-colors"
                                        >
                                            Changer de type
                                        </button>
                                    </div>

                                    {renderCustomSteps()}

                                    <div className="text-right mb-4">
                                        <Button
                                            size="small"
                                            type="text"
                                            onClick={fillRandomData}
                                            className="text-xs text-gray-500 hover:text-blue-500"
                                        >
                                            [DEV] Remplir automatiquement
                                        </Button>
                                    </div>

                                    <Form
                                        form={form}
                                        name="register_form"
                                        onFinish={handleRegister}
                                        layout="vertical"
                                    >
                                        {renderStepContent()}

                                        <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4">
                                            {currentStep > 0 && (
                                                <Button
                                                    onClick={prevStep}
                                                    className="h-12 rounded-lg text-lg font-semibold border-gray-300 hover:border-blue-400 transition-colors"
                                                    size="large"
                                                >
                                                    Précédent
                                                </Button>
                                            )}

                                            {currentStep < getSteps().length - 1 ? (
                                                <Button
                                                    type="primary"
                                                    onClick={nextStep}
                                                    className="h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 rounded-lg text-lg font-semibold flex-1 sm:flex-none shadow-lg transition-all duration-300"
                                                    size="large"
                                                >
                                                    Suivant
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    className="h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border-0 rounded-lg text-lg font-semibold flex-1 sm:flex-none shadow-lg transition-all duration-300"
                                                    loading={loading}
                                                    size="large"
                                                >
                                                    {loading ? 'Finalisation en cours...' : 'Finaliser l\'inscription'}
                                                </Button>
                                            )}
                                        </div>
                                    </Form>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Footer avec informations supplémentaires */}
                    <div className="text-center mt-6 text-sm text-gray-500">
                        <p>Inscription sécurisée • Validation sous 24h • Support 24/7</p>
                    </div>
                </div>
            </div>

            {/* Modal pour la demande d'affiliation */}
            <Modal
                title={`Demande d'affiliation - ${modalType === 'fournisseur' ? 'Partenaire Fournisseur' : 'Représentant'}`}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Envoyer"
                cancelText="Annuler"
                width={600}
                confirmLoading={isSending}
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                            Veuillez remplir vos informations de contact et personnaliser votre message.
                        </p>
                    </div>

                    <Form layout="vertical" size="large">
                        <Form.Item
                            label="Nom complet"
                            required
                            rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                        >
                            <Input
                                value={senderInfo.name}
                                onChange={(e) => setSenderInfo(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Votre nom complet"
                                prefix={<UserOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            required
                            rules={[
                                { required: true, message: 'Veuillez entrer votre email' },
                                { type: 'email', message: 'Email invalide' }
                            ]}
                        >
                            <Input
                                value={senderInfo.email}
                                onChange={(e) => setSenderInfo(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="votre.email@example.com"
                                prefix={<MailOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Téléphone"
                            required
                            rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
                        >
                            <Input
                                value={senderInfo.phone}
                                onChange={(e) => setSenderInfo(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+228 90 00 00 00"
                                prefix={<PhoneOutlined />}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Message"
                            required
                        >
                            <TextArea
                                rows={6}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder="Personnalisez votre message..."
                                className="rounded-lg"
                            />
                        </Form.Item>
                    </Form>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-yellow-800">
                            ⚠️ Notre équipe vous contactera dans les 24-48h suivant votre demande.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Register;