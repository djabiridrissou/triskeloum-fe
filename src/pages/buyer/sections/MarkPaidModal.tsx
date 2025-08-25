import React, { useState } from 'react';
import {
    Modal,
    Form,
    Select,
    Input,
    Upload,
    Button,
    message,
    Typography,
    Space,
    Divider,
    Card,
    Row,
    Col,
    Progress,
    Alert
} from 'antd';
import {
    DollarOutlined,
    FileTextOutlined,
    UploadOutlined,
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    CheckCircleOutlined,
    CloseOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MarkPaidModalProps {
    visible: boolean;
    onClose: () => void;
    sale: any;
    onSuccess: () => void;
}

const MarkPaidModal: React.FC<MarkPaidModalProps> = ({
    visible,
    onClose,
    sale,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileList, setFileList] = useState<any[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    const paymentMethods = [
        { value: 'mixx', label: 'Mixx By Yaas', icon: <WalletOutlined />, color: '#059669' },
        { value: 'flooz', label: 'Flooz', icon: <CreditCardOutlined />, color: '#3b82f6' },
        { value: 'bank', label: 'Virement bancaire', icon: <BankOutlined />, color: '#8b5cf6' }
    ];

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('paymentMethod', values.paymentMethod);
            if (values.notes) {
                formData.append('notes', values.notes);
            }
            
            if (fileList.length > 0) {
                formData.append('paymentProof', fileList[0].originFileObj);
            }

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/sales/mark-paid?saleId=${sale._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    withCredentials: true, // Ajouter les credentials
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                        );
                        setUploadProgress(progress);
                    }
                }
            );

            if (response.data.success) {
                message.success('Paiement enregistré avec succès');
                form.resetFields();
                setFileList([]);
                setSelectedMethod(''); // Reset selected method
                onSuccess();
                onClose();
            }
        } catch (error: any) {
            console.error('Erreur lors du paiement:', error);
            message.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement du paiement');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const handleFileChange = ({ fileList: newFileList }: any) => {
        // Limiter à un seul fichier
        setFileList(newFileList.slice(-1));
    };

    const beforeUpload = (file: any) => {
        const isImage = file.type.startsWith('image/');
        const isPDF = file.type === 'application/pdf';
        
        if (!isImage && !isPDF) {
            message.error('Vous ne pouvez télécharger que des images ou des PDF');
            return false;
        }
        
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Le fichier doit faire moins de 10MB');
            return false;
        }
        
        return false; // Empêcher le téléchargement automatique
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setUploadProgress(0);
        setSelectedMethod(''); // Reset selected method
        onClose();
    };

    const handleMethodSelect = (methodValue: string) => {
        setSelectedMethod(methodValue);
        form.setFieldsValue({ paymentMethod: methodValue });
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            className="modern-modal"
            destroyOnClose
            maskClosable={!loading}
        >
            <div className="p-2">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarOutlined className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <Title level={4} className="mb-0 text-gray-900" style={{ fontSize: '18px' }}>
                                Confirmer le paiement
                            </Title>
                            <Text className="text-gray-500 text-sm">
                                Commande #{sale?.saleNumber}
                            </Text>
                        </div>
                    </div>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    />
                </div>

                {/* Informations de la commande */}
                <Card className="mb-6 bg-gray-50 border-0" bodyStyle={{ padding: '16px' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <div className="text-center">
                                <Text className="text-gray-500 text-xs uppercase tracking-wide">Montant à payer</Text>
                                <div className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatPrice(sale?.totalAmount || 0)}
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="text-center">
                                <Text className="text-gray-500 text-xs uppercase tracking-wide">Client</Text>
                                <div className="font-medium text-gray-900 mt-1 text-sm">
                                    {sale?.buyerId?.fullName || sale?.buyerId?.socialReason}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Formulaire */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    disabled={loading}
                >
                    <Form.Item
                        name="paymentMethod"
                        label={<Text className="text-sm font-medium text-gray-700">Méthode de paiement</Text>}
                        rules={[{ required: true, message: 'Veuillez sélectionner une méthode de paiement' }]}
                    >
                        <div className="grid grid-cols-3 gap-2">
                            {paymentMethods.map((method) => {
                                const isSelected = selectedMethod === method.value;
                                return (
                                    <Card
                                        key={method.value}
                                        className={`cursor-pointer transition-all duration-200 border-2 ${
                                            isSelected 
                                                ? 'shadow-md transform scale-[1.02]' 
                                                : 'hover:shadow-md hover:transform hover:scale-[1.01]'
                                        }`}
                                        bodyStyle={{ padding: '12px' }}
                                        onClick={() => handleMethodSelect(method.value)}
                                        style={{
                                            borderColor: isSelected ? method.color : '#e5e7eb',
                                            backgroundColor: isSelected ? `${method.color}08` : 'white'
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <div 
                                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                                                style={{ 
                                                    backgroundColor: isSelected ? `${method.color}20` : `${method.color}15`,
                                                    color: method.color 
                                                }}
                                            >
                                                {method.icon}
                                            </div>
                                            <Text className={`text-sm font-medium transition-all duration-200 ${
                                                isSelected ? 'text-gray-900' : 'text-gray-700'
                                            }`}>
                                                {method.label}
                                            </Text>
                                            {isSelected && (
                                                <CheckCircleOutlined 
                                                    className="ml-auto text-sm"
                                                    style={{ color: method.color }}
                                                />
                                            )}
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </Form.Item>

                    <Form.Item
                        label={<Text className="text-sm font-medium text-gray-700">Justificatif de paiement</Text>}
                    >
                        <Upload
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={beforeUpload}
                            accept="image/*,.pdf"
                            maxCount={1}
                            className="w-full"
                        >
                            <Button
                                icon={<UploadOutlined />}
                                className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600"
                                style={{ borderRadius: '8px' }}
                            >
                                <div>
                                    <div className="text-sm font-medium">Télécharger un justificatif</div>
                                    <div className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (max. 10MB)</div>
                                </div>
                            </Button>
                        </Upload>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <Progress 
                                percent={uploadProgress} 
                                size="small" 
                                className="mt-2"
                                strokeColor="#10b981"
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        name="notes"
                        label={<Text className="text-sm font-medium text-gray-700">Notes (optionnel)</Text>}
                    >
                        <TextArea
                            placeholder="Ajoutez des notes concernant ce paiement..."
                            rows={3}
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Divider className="my-6" />

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <Button
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 h-10"
                            style={{ borderRadius: '8px' }}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                            className="flex-1 h-10 bg-green-600 hover:bg-green-700 border-green-600"
                            style={{ borderRadius: '8px' }}
                        >
                            {loading ? 'Enregistrement...' : 'Confirmer le paiement'}
                        </Button>
                    </div>
                </Form>
            </div>

            <style>{`
                .modern-modal .ant-modal-content {
                    border-radius: 16px;
                    overflow: hidden;
                }
                .modern-modal .ant-modal-body {
                    padding: 24px;
                }
                .grid {
                    display: grid;
                }
                .grid-cols-2 {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
                .gap-3 {
                    gap: 0.75rem;
                }
            `}</style>
        </Modal>
    );
};

export default MarkPaidModal;