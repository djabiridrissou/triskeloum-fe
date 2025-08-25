import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Input,
    Select,
    Button,
    Tag,
    Space,
    Typography,
    Row,
    Col,
    Statistic,
    Badge,
    Tooltip,
    Avatar,
    Drawer,
    Descriptions,
    Empty,
    DatePicker,
    message,
    Modal,
    Divider,
    Skeleton,
    Image
} from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    ReloadOutlined,
    FilterOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
    DollarOutlined,
    UserOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    ShopOutlined,
    TagOutlined,
    BoxPlotOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useGetOrdersQuery, useGetOrderDetailsQuery } from '../../services/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import MarkPaidModal from './sections/MarkPaidModal';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface SaleItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        designation: string;
        price: number;
        image?: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplierId: {
        _id: string;
        name: string;
        socialReason: string;
    };
}

interface Sale {
    _id: string;
    saleNumber: string;
    buyerId: {
        _id: string;
        fullName: string;
        socialReason: string;
        email: string;
        phoneNumber: string;
    };
    totalAmount: number;
    status: 'pending' | 'pending-payment' | 'completed' | 'delivered' | 'cancelled';
    paymentMethod?: 'cash' | 'card' | 'transfer' | 'credit';
    paymentStatus: 'pending' | 'paid' | 'partial';
    isApproved: boolean;
    notes?: string;
    items: SaleItem[];
    createdAt: string;
    updatedAt: string;
}

interface OrderDetails {
    order: Sale;
    orderItems: SaleItem[];
}

interface UserSalesProps {
    userId?: string;
    showAllUsers?: boolean;
}

const BuyerSales: React.FC<UserSalesProps> = ({
    userId,
    showAllUsers = false
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
    const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedSaleForPayment, setSelectedSaleForPayment] = useState<Sale | null>(null);

    const effectiveUserId = userId || localStorage.getItem('userId') || '';

    const {
        data: salesData,
        isLoading,
        error,
        refetch
    } = useGetOrdersQuery({
        page: currentPage,
        limit: pageSize,
        searchQuery,
        sortField,
        sortOrder,
        buyerId: showAllUsers ? undefined : effectiveUserId,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        paymentMethod: paymentMethodFilter || undefined,
    });

    // Requête pour les détails de commande
    const {
        data: orderDetailsData,
        isLoading: isLoadingDetails,
        error: detailsError
    } = useGetOrderDetailsQuery(selectedSaleId, {
        skip: !selectedSaleId
    });

    const sales = salesData?.data || [];
    const pagination = salesData?.pagination;
    const orderDetails: OrderDetails | null = orderDetailsData?.data || null;

    const stats = React.useMemo(() => {
        if (!sales.length) return { total: 0, pending: 0, completed: 0, totalAmount: 0 };

        return {
            total: sales.length,
            pending: sales.filter((s: Sale) => s.status === 'pending').length,
            completed: sales.filter((s: Sale) => s.status === 'completed').length,
            totalAmount: sales.reduce((sum: number, s: Sale) => sum + s.totalAmount, 0)
        };
    }, [sales]);

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: { color: '#F59E0B', label: 'En attente de confirmation', icon: <ClockCircleOutlined />, bgColor: '#FEF3C7' },
            'pending-payment': { color: '#3B82F6', label: 'En attente de paiement', icon: <DollarOutlined />, bgColor: '#DBEAFE' },
            completed: { color: '#10B981', label: 'Terminée', icon: <CheckCircleOutlined />, bgColor: '#D1FAE5' },
            delivered: { color: '#06B6D4', label: 'Livrée', icon: <CheckCircleOutlined />, bgColor: '#CFFAFE' },
            cancelled: { color: '#EF4444', label: 'Annulée', icon: <ClockCircleOutlined />, bgColor: '#FEE2E2' },
        };
        return configs[status as keyof typeof configs] || configs.pending;
    };

    // Fonctions pour gérer le modal de paiement
    const handlePay = (sale: Sale) => {
        console.log('handlePay called with sale:', sale._id); // Debug
        setSelectedSaleForPayment(sale);
        setPaymentModalVisible(true);
    };

    const handlePaymentModalClose = () => {
        console.log('Closing payment modal'); // Debug
        setPaymentModalVisible(false);
        setSelectedSaleForPayment(null);
    };

    const handlePaymentSuccess = () => {
        console.log('Payment success, refetching data'); // Debug
        refetch();
    };

    const getPaymentStatusConfig = (status: string) => {
        const configs = {
            pending: { color: '#F59E0B', label: 'En attente', bgColor: '#FEF3C7' },
            paid: { color: '#10B981', label: 'Payée', bgColor: '#D1FAE5' },
            partial: { color: '#3B82F6', label: 'Partiel', bgColor: '#DBEAFE' },
        };
        return configs[status as keyof typeof configs] || configs.pending;
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleViewDetails = (sale: Sale) => {
        setSelectedSaleId(sale._id);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setSelectedSaleId(null);
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);

        if (sorter.field) {
            setSortField(sorter.field);
            setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPaymentStatusFilter('');
        setPaymentMethodFilter('');
        setCurrentPage(1);
        message.success('Filtres réinitialisés');
    };

    const columns: ColumnsType<Sale> = [
        {
            title: 'N° Commande',
            dataIndex: 'saleNumber',
            key: 'saleNumber',
            width: 140,
            render: (text: string) => (
                <div className="font-mono text-sm">
                    <div className="font-semibold text-gray-900">{text}</div>
                </div>
            ),
            sorter: true,
        },
        ...(showAllUsers ? [{
            title: 'Client',
            dataIndex: 'buyerId',
            key: 'buyer',
            width: 200,
            render: (buyer: any) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Text className="text-white text-xs font-semibold">
                            {(buyer?.fullName || buyer?.socialReason || '').charAt(0).toUpperCase()}
                        </Text>
                    </div>
                    <div>
                        <div className="font-medium text-sm text-gray-900">
                            {buyer?.fullName || buyer?.socialReason}
                        </div>
                        <div className="text-xs text-gray-500">{buyer?.email}</div>
                    </div>
                </div>
            ),
        }] : []),
        {
            title: 'Montant',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 120,
            render: (amount: number) => (
                <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatPrice(amount)}</div>
                </div>
            ),
            sorter: true,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: string) => (
                <div className="text-sm">
                    <div className="font-medium text-gray-900">{dayjs(date).format('DD/MM/YYYY')}</div>
                    <div className="text-xs text-gray-500">{dayjs(date).format('HH:mm')}</div>
                </div>
            ),
            sorter: true,
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: string) => {
                const config = getStatusConfig(status);
                return (
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: config.bgColor, color: config.color }}>
                        {config.icon}
                        <span className="ml-1">{config.label}</span>
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record: Sale) => {
                // Logique de détermination de l'état
                const canPay = record.status !== 'pending' && record.paymentStatus === 'pending';
                const isPaid = record.paymentStatus === 'paid';
                const isPending = record.status === 'pending';
                const isPartial = record.paymentStatus === 'partial';

                // Configuration du bouton selon l'état
                let config = {
                    text: 'Payer',
                    icon: <DollarOutlined />,
                    style: {
                        borderColor: '#10b981',
                        color: '#047857',
                        backgroundColor: '#ecfdf5',
                        cursor: 'pointer'
                    },
                    tooltip: "Cliquez pour effectuer le paiement",
                    disabled: false
                };

                if (isPaid) {
                    config = {
                        text: 'Payé',
                        icon: <CheckCircleOutlined />,
                        style: {
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            backgroundColor: '#f9fafb',
                            cursor: 'not-allowed'
                        },
                        tooltip: "Commande déjà payée",
                        disabled: true
                    };
                } else if (isPartial) {
                    config = {
                        text: 'Partiel',
                        icon: <ExclamationCircleOutlined />,
                        style: {
                            borderColor: '#3b82f6',
                            color: '#1e40af',
                            backgroundColor: '#dbeafe',
                            cursor: 'pointer'
                        },
                        tooltip: "Paiement partiel - cliquez pour compléter",
                        disabled: false
                    };
                } else if (isPending) {
                    config = {
                        text: 'En attente',
                        icon: <ClockCircleOutlined />,
                        style: {
                            borderColor: '#d1d5db',
                            color: '#6b7280',
                            backgroundColor: '#f9fafb',
                            cursor: 'not-allowed'
                        },
                        tooltip: "La commande doit être confirmée avant le paiement",
                        disabled: true
                    };
                }

                return (
                    <div className='flex gap-2'>
                        <Tooltip title={config.tooltip}>
                            <Button
                                size="small"
                                onClick={() => {
                                    if (!config.disabled) {
                                        console.log('Button clicked for sale:', record._id); // Debug
                                        handlePay(record);
                                    }
                                }}
                                disabled={config.disabled}
                                className="rounded-md flex items-center gap-1"
                                style={config.style}
                                icon={config.icon}
                            >
                                {config.text}
                            </Button>
                        </Tooltip>
                    </div>
                );
            },
        }
    ];

    return (
        <div className="w-full space-y-6 bg-gray-50 min-h-screen p-6">
            {/* En-tête */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <Title level={3} className="mb-2 text-gray-900">
                            {showAllUsers ? 'Gestion des Ventes' : 'Mes Commandes'}
                        </Title>
                        <Text className="text-gray-600">
                            Suivez vos {showAllUsers ? 'ventes' : 'commandes'} en temps réel
                        </Text>
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => refetch()}
                        loading={isLoading}
                        className="border-gray-300 hover:border-blue-500"
                    >
                        Actualiser
                    </Button>
                </div>

                {/* Statistiques */}
                <Row gutter={[20, 20]} className="mb-6">
                    <Col xs={12} sm={6}>
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                                    <div className="text-sm text-blue-600">Total</div>
                                </div>
                                <ShoppingCartOutlined className="text-2xl text-blue-500" />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-orange-700">{stats.pending}</div>
                                    <div className="text-sm text-orange-600">En attente</div>
                                </div>
                                <ClockCircleOutlined className="text-2xl text-orange-500" />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
                                    <div className="text-sm text-green-600">Terminées</div>
                                </div>
                                <CheckCircleOutlined className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={6}>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-bold text-purple-700">{formatPrice(stats.totalAmount)}</div>
                                    <div className="text-sm text-purple-600">Montant</div>
                                </div>
                                <DollarOutlined className="text-2xl text-purple-500" />
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3 items-center">
                    <Select
                        placeholder="Filtrer par statut"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowClear
                        className="min-w-[180px]"
                        style={{ borderRadius: '8px' }}
                    >
                        <Option value="">Tous les statuts</Option>
                        <Option value="pending">En attente de confirmation</Option>
                        <Option value="pending-payment">En attente paiement</Option>
                        <Option value="completed">Terminée</Option>
                        <Option value="delivered">Livrée</Option>
                        <Option value="cancelled">Annulée</Option>
                    </Select>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={clearFilters}
                        className="border-gray-300 hover:border-red-500 hover:text-red-500"
                    >
                        Réinitialiser
                    </Button>
                </div>
            </div>

            {/* Tableau */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table<Sale>
                    columns={columns}
                    dataSource={sales}
                    rowKey="_id"
                    loading={isLoading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: pagination?.total || 0,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} sur ${total} éléments`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Aucune commande trouvée"
                            />
                        ),
                    }}
                    className="luxury-table"
                />
            </div>

            {/* Modal de paiement - PLACÉ ICI DANS LE JSX DE RETOUR */}
            <MarkPaidModal
                visible={paymentModalVisible}
                onClose={handlePaymentModalClose}
                sale={selectedSaleForPayment}
                onSuccess={handlePaymentSuccess}
            />

            <style>{`
                .luxury-table .ant-table-thead > tr > th {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-bottom: 2px solid #e2e8f0;
                    font-weight: 600;
                    color: #334155;
                }
                
                .luxury-table .ant-table-tbody > tr:hover > td {
                    background: #f8fafc;
                }
                
                .luxury-modal .ant-modal-content {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                
                .luxury-modal .ant-modal-header {
                    display: none;
                }
                
                .luxury-modal .ant-modal-body {
                    padding: 24px;
                }
            `}</style>
        </div>
    );
};

export default BuyerSales;