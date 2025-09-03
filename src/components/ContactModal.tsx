// ContactModal.jsx
import { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";

const { TextArea } = Input;

const ContactModal = ({ isVisible, onClose, type }: any) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');

    // Mettre à jour le message quand le type change
    useEffect(() => {
        if (type) {
            const newMessage = getDefaultMessage(type);
            setCurrentMessage(newMessage);
            form.setFieldsValue({ message: newMessage });
        }
    }, [type, form]);

    const getDefaultMessage = (type: any) => {
        switch (type) {
            case 'fournisseur':
                return `Bonjour,\n\nJe souhaite devenir partenaire fournisseur de la société TERMINAL D'ECHANGES SARL U.\n\nType de fournisseur: National/International\n\nMerci de me contacter pour les prochaines étapes.\n\nCordialement`;
            case 'representant':
                return `Bonjour,\n\nJe souhaite devenir représentant pour Terminal d'Échanges SARL U.\n\nType de représentation: Régional/National\n\nMerci de me contacter pour les prochaines étapes.\n\nCordialement`;
            default:
                return '';
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/contact/new`, {
                name: values.name,
                email: values.email,
                phone: values.phone,
                message: `Type de demande: ${type === 'fournisseur' ? 'Partenaire Fournisseur' : 'Représentant'}\n\n${values.message}`
            });

            toast.success('Votre demande a été envoyée avec succès');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            toast.error('Une erreur est survenue lors de l\'envoi de votre demande');
        } finally {
            setLoading(false);
        }
    };

    // Reset complet du formulaire quand la modale s'ouvre/ferme
    useEffect(() => {
        if (isVisible) {
            form.resetFields();
            const newMessage = getDefaultMessage(type);
            setCurrentMessage(newMessage);
            form.setFieldsValue({ message: newMessage });
        }
    }, [isVisible, type, form]);

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={`Demande d'affiliation - ${type === 'fournisseur' ? 'Partenaire Fournisseur' : 'Représentant'}`}
            open={isVisible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose={true} // Important: force le re-render à la fermeture
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={false} // Important: ne pas préserver les valeurs
            >
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-blue-800">
                        Veuillez remplir vos informations de contact et personnaliser votre message.
                    </p>
                </div>

                <Form.Item 
                    name="name"
                    label="Nom complet"
                    rules={[{ required: true, message: 'Veuillez entrer votre nom complet' }]}
                >
                    <Input 
                        placeholder="Votre nom complet"
                        prefix={<UserOutlined />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item 
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Veuillez entrer votre email' },
                        { type: 'email', message: 'Email invalide' }
                    ]}
                >
                    <Input 
                        placeholder="votre.email@example.com"
                        prefix={<MailOutlined />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item 
                    name="phone"
                    label="Téléphone"
                    rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
                >
                    <Input 
                        placeholder="+228 90 00 00 00"
                        prefix={<PhoneOutlined />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item 
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Veuillez entrer votre message' }]}
                >
                    <TextArea 
                        rows={6}
                        placeholder="Personnalisez votre message..."
                        className="rounded-lg"
                    />
                </Form.Item>

                <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-yellow-800">
                        ⚠️ Notre équipe vous contactera dans les 24-48h suivant votre demande.
                    </p>
                </div>

                <Form.Item>
                    <div className="flex gap-3">
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            className="flex-1"
                            size="large"
                        >
                            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                        </Button>
                        <Button 
                            onClick={handleCancel} 
                            size="large"
                            className="flex-1"
                        >
                            Annuler
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ContactModal;