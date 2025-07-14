// src/components/payment/CreatePayRequest.tsx
import { useState } from "react";
import { Button, Input, Card, Form, Alert, Divider } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useCreatePayRequestMutation } from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
    available: boolean;
}

const CreatePayRequest = () => {
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [createPayRequest, { isLoading }] = useCreatePayRequestMutation();
    const navigate = useNavigate();

    const ressource = localStorage.getItem('ressource') || "";
    const userId = localStorage.getItem('userId') || "";
    const currency = localStorage.getItem('currency') || "XOF";
    const amount = localStorage.getItem('feeAmount') || '0';

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'MIXX_BY_YAS',
            name: 'Mixx by Yas',
            icon: <img src="/images/mixx.png" className="w-12 h-12 object-contain" />,
            available: true
        },
        {
            id: 'FLOOZ',
            name: 'Flooz',
            icon: <img src="/images/flooz.png" className="w-12 h-12 object-contain" />,
            available: true
        },
        {
            id: 'CREDIT_CARD',
            name: 'Carte de crédit',
            icon: <img src="/images/visa.png" className="w-12 h-12 object-contain" />,
            available: false
        }
    ];

    const togoPhoneRegex = /^(90|91|92|93|96|97|98|99|70|79)\d{6}$/;

    const validateTogoPhone = (phoneNumber: string) => {
        const cleanedNumber = phoneNumber.replace(/[\s-]/g, '');
        if (cleanedNumber.startsWith('+228')) {
            return togoPhoneRegex.test(cleanedNumber.substring(4));
        } else if (cleanedNumber.startsWith('228')) {
            return togoPhoneRegex.test(cleanedNumber.substring(3));
        } else {
            return togoPhoneRegex.test(cleanedNumber);
        }
    };

    const handlePaymentRequest = async (values: { phoneNumber: string }) => {
        if (!selectedMethod) {
            Swal.fire({
                icon: 'warning',
                title: 'Méthode de paiement',
                text: 'Veuillez sélectionner une méthode de paiement.',
            });
            return;
        }

        if (selectedMethod === 'CREDIT_CARD') {
            return; // Ne devrait pas arriver car le bouton est désactivé
        }

        // Validation du numéro de téléphone
        if (!validateTogoPhone(values.phoneNumber)) {
            Swal.fire({
                icon: 'error',
                title: 'Numéro invalide',
                text: 'Veuillez entrer un numéro de téléphone togolais valide.',
            });
            return;
        }

        const paymentData = {
            phoneNumber: values.phoneNumber.replace(/[\s-]/g, ''), // Nettoyer le numéro
            ressource,
            userId,
            method: selectedMethod === 'MIXX_BY_YAS' ? 'TMONEY' : selectedMethod,
            currency,
            description: 'Frais de création de compte'
        };

        try {
            const result = await createPayRequest(paymentData);

            if ('error' in result) {
                console.log('Payment request error:', result.error);
                const error = result.error as any;
                const message = error?.data?.message || error?.message || 'Erreur lors de la création de la demande de paiement';

                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de paiement',
                    text: message,
                });
                return;
            }

            // Succès
            const response = result.data;
            
            Swal.fire({
                icon: 'success',
                title: 'Demande créée',
                text: response.message || 'Votre demande de paiement a été créée avec succès.',
                timer: 3000,
                showConfirmButton: false,
            });

          localStorage.setItem('paymentReference', response?.data?._id);
          navigate("/confirm-pay");
        } catch (error: any) {
            console.error('Payment request error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur serveur',
                text: 'Une erreur interne s\'est produite. Veuillez réessayer plus tard.',
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    {/* <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Retour
                    </button> */}
                    <div className="flex justify-center items-center mb-4">
                        <img src="/images/logob.png" alt="Logo" className="h-12 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Frais d'inscription
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Choisissez votre méthode de paiement
                    </p>
                </div>

                {/* Main Card */}
                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                    <div className="p-6">
                        {/* Payment Methods Selection */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                Méthode de paiement
                            </h3>
                            <div className="flex justify-center gap-4">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                            selectedMethod === method.id
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : method.available
                                                ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                                        }`}
                                        onClick={() => method.available && setSelectedMethod(method.id)}
                                    >
                                        {method.icon}
                                        
                                        {/* Selected indicator */}
                                        {selectedMethod === method.id && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        
                                        {/* Not available indicator */}
                                        {!method.available && (
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                                <AlertCircle className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Selected method name */}
                            {selectedMethod && (
                                <p className="text-center text-sm text-gray-600 mt-3">
                                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                                </p>
                            )}
                        </div>

                        {/* Credit Card Not Available Message */}
                        {selectedMethod === 'CREDIT_CARD' && (
                            <Alert
                                message="Non disponible"
                                description="Le paiement par carte n'est pas encore disponible."
                                type="warning"
                                showIcon
                                className="mb-6"
                            />
                        )}

                        {/* Phone Number Form */}
                        {selectedMethod && selectedMethod !== 'CREDIT_CARD' && (
                            <div className="space-y-6">
                                <Divider />
                                <Form
                                    name="payment_form"
                                    onFinish={handlePaymentRequest}
                                    layout="vertical"
                                >
                                    <Form.Item
                                        label="Numéro de téléphone"
                                        name="phoneNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Veuillez entrer votre numéro de téléphone!'
                                            },
                                            {
                                                validator: (_, value) => {
                                                    if (!value || validateTogoPhone(value)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error('Numéro de téléphone togolais invalide!')
                                                    );
                                                }
                                            }
                                        ]}
                                    >
                                        <Input
                                            prefix={<PhoneOutlined />}
                                            placeholder="70609243"
                                            size="large"
                                            className="rounded-lg"
                                            addonBefore="+228"
                                        />
                                    </Form.Item>

                                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                        <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                                            Détails du paiement
                                        </h4>
                                        <div className="text-sm text-blue-800 space-y-1">
                                            <p>• Montant: {amount} FCFA</p>
                                            <p>• Frais de création de compte</p>
                                        </div>
                                    </div>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoading}
                                            size="large"
                                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none rounded-lg text-lg font-semibold"
                                        >
                                            {isLoading ? 'Traitement...' : 'Procéder au paiement'}
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        )}

                        {/* Security Info */}
                        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="font-semibold text-gray-900 text-sm">Paiement sécurisé</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                Vos informations sont protégées par un cryptage SSL.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CreatePayRequest;