// src/components/payment/ConfirmPay.tsx
import { useState } from "react";
import { Button, Card, Alert, Result } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useValidatePaymentMutation } from "../../services/api";

const ConfirmPay = () => {
    const [validatePayment, { isLoading }] = useValidatePaymentMutation();
    const navigate = useNavigate();
    const paymentReference = localStorage.getItem('paymentReference');
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

    const handleValidatePayment = async () => {
        if (!paymentReference) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Référence de paiement introuvable. Veuillez recommencer le processus.',
            });
            navigate('/fees');
            return;
        }

        try {
            const result = await validatePayment({ feeId: paymentReference });

            if ('error' in result) {
                console.log('Payment validation error:', result.error);
                const error = result.error as any;
                const message = error?.data?.message || error?.message || 'Erreur lors de la validation du paiement';

                Swal.fire({
                    icon: 'error',
                    title: 'Erreur de validation',
                    text: message,
                });
                setPaymentStatus('failed');
                return;
            }

            // Succès
            const response = result.data;

            if (response.status === 200) {
                setPaymentStatus('success');
                localStorage.removeItem('paymentReference');
                localStorage.removeItem('feeAmount');
                Swal.fire({
                    icon: 'success',
                    title: 'Paiement validé',
                    text: 'Votre paiement a été confirmé avec succès.',
                    timer: 3000,
                    showConfirmButton: false,
                }).then(() => {
                    navigate('/login'); // Rediriger vers la page de succès
                });
            } else {
                setPaymentStatus('failed');
                Swal.fire({
                    icon: 'warning',
                    title: 'Paiement non confirmé',
                    text: 'Le paiement n\'a pas encore été effectué. Veuillez réessayer après avoir effectué le paiement.',
                });
            }
        } catch (error: any) {
            console.error('Payment validation error:', error);
            setPaymentStatus('failed');
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
                    <div className="flex justify-center items-center mb-4">
                        <img src="/images/logob.png" alt="Logo" className="h-12 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Confirmation de paiement
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Validez votre transaction après avoir effectué le paiement
                    </p>
                </div>

                {/* Main Card */}
                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
                    <div className="p-6">
                        {paymentStatus === 'pending' && (
                            <>
                                <div className="text-center mb-6">
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src="/images/logob.png"
                                            alt="Pending payment"
                                            className="h-32 w-auto"
                                        />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                        Paiement en attente
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Veuillez effectuer le paiement dans votre application mobile puis cliquer sur le bouton ci-dessous pour valider.
                                    </p>

                                    <Alert
                                        message="Instructions"
                                        description={
                                            <ol className="list-decimal pl-4 space-y-1 text-left">
                                                <li>Vous verrez une requete de paiement sur votre telephone</li>
                                                <li>Effectuez le paiement du montant indiqué</li>
                                                <li>Revenez sur cette page et cliquez sur "Valider le paiement"</li>
                                            </ol>
                                        }
                                        type="info"
                                        showIcon
                                        className="mb-6 text-left"
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <Button
                                        type="primary"
                                        onClick={handleValidatePayment}
                                        loading={isLoading}
                                        size="large"
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none rounded-lg text-lg font-semibold"
                                        icon={<CheckCircleFilled />}
                                    >
                                        {isLoading ? 'Validation en cours...' : 'Valider le paiement'}
                                    </Button>
                                    <span onClick={() => navigate('/fees')} className="text-[8px] text-gray-500 cursor-pointer underline">Vous pouvez demander une nouvelle requete de paiement</span>
                                </div>

                            </>
                        )}

                        {paymentStatus === 'success' && (
                            <Result
                                status="success"
                                title="Paiement confirmé avec succès!"
                                subTitle="Reconnectez-vous pour accéder aux services."
                                extra={[
                                    <Button
                                        type="primary"
                                        key="home"
                                        onClick={() => navigate('/login')}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none rounded-lg text-lg font-semibold"
                                    >
                                        Retour à la page de connexion
                                    </Button>,
                                ]}
                            />
                        )}

                        {paymentStatus === 'failed' && (
                            <Result
                                status="error"
                                title="Paiement non confirmé"
                                subTitle="Le paiement n'a pas pu être confirmé. Veuillez réessayer après avoir effectué le paiement."
                                extra={[
                                    <Button
                                        type="primary"
                                        key="retry"
                                        onClick={handleValidatePayment}
                                        loading={isLoading}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none rounded-lg text-lg font-semibold"
                                    >
                                        Réessayer
                                    </Button>,
                                    <Button
                                        key="back"
                                        onClick={() => navigate('/fees')}
                                        className="w-full h-12 mt-4 border-gray-300 rounded-lg text-lg font-semibold"
                                    >
                                        Retour
                                    </Button>,
                                ]}
                            />
                        )}

                        {/* Security Info */}
                        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-[6px]">
                            <div className="flex items-center space-x-2 mb-1">
                                <CheckCircleFilled className="text-green-500" />
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

export default ConfirmPay;