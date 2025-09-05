import { ArrowLeft, Loader2, ChevronRight } from "lucide-react";
import { useState } from "react";
import OrderSummary from "./components/OrderSummary";
import PaymentPhoneInput from "./components/PaymentPhoneInput";
import RechargeDetailsForm from "./components/RechargeDetailsForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

const RechargeCredit = () => {
    const [step, setStep] = useState(1);
    const [network, setNetwork] = useState('');
    const [recipientNumber, setRecipientNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const validateAndProceed = () => {
        const newErrors: any = {};

        if (step === 1) {
            if (!network) {
                newErrors.network = 'Veuillez sélectionner un réseau';
            }
            if (!recipientNumber) {
                newErrors.recipientNumber = 'Veuillez entrer le numéro bénéficiaire';
            } else if (recipientNumber.replace(/\s/g, '').length < 8) {
                newErrors.recipientNumber = 'Numéro invalide (8 chiffres minimum)';
            }
            if (!amount) {
                newErrors.amount = 'Veuillez entrer un montant';
            } else if (parseInt(amount) < 100 || parseInt(amount) > 500000) {
                newErrors.amount = 'Le montant doit être entre 100 et 500,000 FCFA';
            }
        }

        if (step === 2 && !paymentMethod) {
            newErrors.payment = 'Veuillez sélectionner un moyen de paiement';
        }

        if (step === 3) {
            if (!phoneNumber) {
                newErrors.phone = 'Veuillez entrer votre numéro de paiement';
            } else if (phoneNumber.replace(/\s/g, '').length < 8) {
                newErrors.phone = 'Numéro de téléphone invalide';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (step < 4) {
                setStep(step + 1);
            } else {
                processPayment();
            }
        }
    };

    const processPayment = async () => {
        setLoading(true);
        // Simulation du traitement
        await new Promise(resolve => setTimeout(resolve, 5000));
        setLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'Recharge réussie',
            text: `${parseInt(amount).toLocaleString()} FCFA ont été crédité au ${recipientNumber}`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#4F46E5'
        });

        // Réinitialisation
        setStep(1);
        setNetwork('');
        setRecipientNumber('');
        setAmount('');
        setPaymentMethod('');
        setPhoneNumber('');
    };

    const goBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setErrors({});
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Informations de recharge";
            case 2: return "Moyen de paiement";
            case 3: return "Numéro de paiement";
            case 4: return "Confirmation";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        {step > 1 && !loading && (
                            <button
                                onClick={goBack}
                                className="p-2 rounded-lg hover:bg-white/80 bg-white/50 backdrop-blur transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">Recharge Crédit</h1>
                            <p className="text-gray-600 text-xs mt-1">{getStepTitle()}</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`flex-1 h-2 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                                <div className="absolute inset-0 blur-xl bg-blue-400 opacity-30 animate-pulse" />
                            </div>
                            <p className="text-lg text-gray-800 font-semibold mt-6">Traitement en cours...</p>
                            <p className="text-sm text-gray-500 mt-2">Veuillez patienter quelques instants</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <RechargeDetailsForm
                                    network={network}
                                    setNetwork={setNetwork}
                                    recipientNumber={recipientNumber}
                                    setRecipientNumber={setRecipientNumber}
                                    amount={amount}
                                    setAmount={setAmount}
                                    errors={errors}
                                />
                            )}

                            {step === 2 && (
                                <PaymentMethodSelector
                                    onSelect={setPaymentMethod}
                                    selectedMethod={paymentMethod}
                                    recipientNetwork={network}
                                />
                            )}

                            {step === 3 && (
                                <PaymentPhoneInput
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                    error={errors.phone}
                                    paymentMethod={paymentMethod}
                                />
                            )}

                            {step === 4 && (
                                <OrderSummary
                                    network={network}
                                    recipientNumber={recipientNumber}
                                    amount={amount}
                                    paymentMethod={paymentMethod}
                                    phoneNumber={phoneNumber}
                                />
                            )}

                            {/* Action button */}
                            <div className="mt-8">
                                <button
                                    onClick={validateAndProceed}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {step === 4 ? 'Confirmer et payer' : 'Continuer'}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RechargeCredit;