import React, { useState } from 'react';
import {
    Table,
    Button,
    Typography,
    Row,
    Col,
    Empty,
    message,
    Modal,
    Divider,
    Skeleton,
    Image,
    Popconfirm,
    Select,
    Tag
} from 'antd';
import {
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
    BoxPlotOutlined,
    CheckOutlined,
    CloseOutlined,
    NotificationOutlined,
    ExclamationCircleOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { 
    useAdminOrdersQuery, 
    useGetOrderDetailsQuery, 
    useApproveOrderMutation,
    useEmailPaymentRequestMutation 
} from '../../services/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;
const { Option } = Select;

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
    isProcessed: boolean;
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
}

const AdminOrders: React.FC<UserSalesProps> = ({ userId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
    const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    const [approveOrder, { isLoading: isApproving }] = useApproveOrderMutation();
    const [emailPaymentRequest, { isLoading: isSendingEmail }] = useEmailPaymentRequestMutation();

    const effectiveUserId = userId || localStorage.getItem('userId') || '';

    const {
        data: salesData,
        isLoading,
        refetch
    } = useAdminOrdersQuery({
        page: currentPage,
        limit: pageSize,
        sortField,
        sortOrder,
        buyerId: true ? undefined : effectiveUserId,
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
    });

    const {
        data: orderDetailsData,
        isLoading: isLoadingDetails,
        refetch: refetchDetails
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
            pending: { color: '#F59E0B', label: 'En attente', icon: <ClockCircleOutlined />, bgColor: '#FEF3C7' },
            'pending-payment': { color: '#3B82F6', label: 'En attente de paiement', icon: <DollarOutlined />, bgColor: '#DBEAFE' },
            completed: { color: '#10B981', label: 'Terminée', icon: <CheckCircleOutlined />, bgColor: '#D1FAE5' },
            delivered: { color: '#06B6D4', label: 'Livrée', icon: <CheckCircleOutlined />, bgColor: '#CFFAFE' },
            cancelled: { color: '#EF4444', label: 'Annulée', icon: <CloseOutlined />, bgColor: '#FEE2E2' },
        };
        return configs[status as keyof typeof configs] || configs.pending;
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

    const handleApproveOrder = async () => {
        if (!selectedSaleId) {
            message.error('Aucune commande sélectionnée');
            return;
        }

        try {
            const result = await approveOrder({
                orderId: selectedSaleId,
                decision: 1
            }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: result.message || 'Commande approuvée avec succès',
                confirmButtonColor: '#10B981',
                timer: 3000
            });
            
            refetch();
            refetchDetails();
            
        } catch (error: any) {
            console.error('Erreur lors de l\'approbation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error?.data?.message || 'Erreur lors de l\'approbation de la commande',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const handleRejectOrder = async () => {
        if (!selectedSaleId) {
            message.error('Aucune commande sélectionnée');
            return;
        }

        try {
            const result = await approveOrder({
                orderId: selectedSaleId,
                decision: 0
            }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: result.message || 'Commande rejetée avec succès',
                confirmButtonColor: '#10B981',
                timer: 3000
            });
            
            refetch();
            refetchDetails();
            
        } catch (error: any) {
            console.error('Erreur lors du rejet:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error?.data?.message || 'Erreur lors du rejet de la commande',
                confirmButtonColor: '#EF4444'
            });
        }
    };

    const handleSendPaymentNotification = async () => {
        if (!selectedSaleId) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Aucune commande sélectionnée',
                confirmButtonColor: '#3B82F6'
            });
            return;
        }

        try {
            const result = await emailPaymentRequest({
                orderId: selectedSaleId
            }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Email envoyé !',
                text: result.message || 'Demande de paiement envoyée avec succès',
                confirmButtonColor: '#10B981',
                timer: 3000,
                timerProgressBar: true
            });

        } catch (error: any) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur d\'envoi',
                text: error?.data?.message || 'Erreur lors de l\'envoi de la demande de paiement',
                confirmButtonColor: '#EF4444'
            });
        }
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
        setStatusFilter('');
        setPaymentStatusFilter('');
        setCurrentPage(1);
        message.success('Filtres réinitialisés');
    };

    const canProcessOrder = (order: Sale) => {
        return order.status === 'pending' && !order.isProcessed;
    };

    const canSendNotification = (order: Sale) => {
        return order.status === 'pending-payment' && order.isProcessed;
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
        {
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
        },
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
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: string, record: Sale) => {
                const config = getStatusConfig(status);
                return (
                    <div className="space-y-1">
                        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: config.bgColor, color: config.color }}>
                            {config.icon}
                            <span className="ml-1">{config.label}</span>
                        </div>
                        {!record.isProcessed && status === 'pending' && (
                            <div className="text-xs text-orange-600 font-medium">
                                En attente de traitement
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Paiement',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 120,
            render: (status: string) => {
                const config = getPaymentStatusConfig(status);
                return (
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: config.bgColor, color: config.color }}>
                        {config.label}
                    </div>
                );
            },
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
            title: '',
            key: 'actions',
            width: 60,
            render: (_, record: Sale) => (
                <Button
                    size="small"
                    onClick={() => handleViewDetails(record)}
                    className="border border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-md px-3"
                    style={{
                        borderColor: '#bfdbfe',
                        color: '#2563eb',
                        backgroundColor: 'transparent'
                    }}
                >
                    Détails
                </Button>
            ),
        }
    ];

    return (
        <div className="w-full space-y-6 bg-gray-50 min-h-screen p-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <Title level={3} className="mb-2 text-gray-900">
                            Gestion des Commandes
                        </Title>
                        <Text className="text-gray-600">
                            Gérez et suivez toutes les commandes de la plateforme
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

                {/* Stats */}
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

                {/* Filters */}
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
                        <Option value="pending">En attente</Option>
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

            {/* Table */}
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
                />
            </div>

            {/* Order Details Modal */}
            <Modal
                title={null}
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={900}
                className="luxury-modal"
                style={{ top: 20 }}
            >
                {isLoadingDetails ? (
                    <div className="p-6">
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </div>
                ) : orderDetails ? (
                    <div className="bg-white">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 -m-6 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs opacity-75 mb-1">Commande</div>
                                    <div className="text-xl font-medium tracking-wide">
                                        {orderDetails.order.saleNumber}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs opacity-75 mb-1">Montant Total</div>
                                    <div className="text-xl font-medium">
                                        {formatPrice(orderDetails.order.totalAmount)}
                                    </div>
                                </div>
                            </div>
                            
                            {!orderDetails.order.isProcessed && orderDetails.order.status === 'pending' && (
                                <div className="mt-3 px-3 py-1 bg-orange-500 bg-opacity-20 rounded-full inline-flex items-center">
                                    <ExclamationCircleOutlined className="mr-2 text-orange-300" />
                                    <span className="text-xs font-medium text-orange-200">
                                        Commande en attente de traitement
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-4 flex gap-3 justify-end">
                            {canProcessOrder(orderDetails.order) ? (
                                <>
                                    <Popconfirm
                                        title="Approuver la commande"
                                        description="Êtes-vous sûr de vouloir approuver cette commande ? Elle passera en attente de paiement."
                                        onConfirm={handleApproveOrder}
                                        okText="Oui, approuver"
                                        cancelText="Annuler"
                                        okButtonProps={{ loading: isApproving }}
                                        icon={<CheckCircleOutlined style={{ color: '#10B981' }} />}
                                    >
                                        <Button
                                            icon={isApproving ? <LoadingOutlined /> : <CheckOutlined />}
                                            loading={isApproving}
                                            disabled={isApproving}
                                            style={{
                                                borderColor: '#10B981',
                                                color: '#10B981',
                                                backgroundColor: 'transparent'
                                            }}
                                            className="hover:bg-green-50"
                                        >
                                            Approuver
                                        </Button>
                                    </Popconfirm>

                                    <Popconfirm
                                        title="Rejeter la commande"
                                        description="Êtes-vous sûr de vouloir rejeter cette commande ? Cette action est irréversible."
                                        onConfirm={handleRejectOrder}
                                        okText="Oui, rejeter"
                                        cancelText="Annuler"
                                        okButtonProps={{ loading: isApproving, danger: true }}
                                        icon={<ExclamationCircleOutlined style={{ color: '#EF4444' }} />}
                                    >
                                        <Button
                                            icon={isApproving ? <LoadingOutlined /> : <CloseOutlined />}
                                            loading={isApproving}
                                            disabled={isApproving}
                                            style={{
                                                borderColor: '#EF4444',
                                                color: '#EF4444',
                                                backgroundColor: 'transparent'
                                            }}
                                            className="hover:bg-red-50"
                                        >
                                            Rejeter
                                        </Button>
                                    </Popconfirm>
                                </>
                            ) : canSendNotification(orderDetails.order) ? (
                                <Button
                                    icon={isSendingEmail ? <LoadingOutlined /> : <NotificationOutlined />}
                                    onClick={handleSendPaymentNotification}
                                    loading={isSendingEmail}
                                    disabled={isSendingEmail}
                                    style={{
                                        borderColor: '#3B82F6',
                                        color: '#3B82F6',
                                        backgroundColor: 'transparent'
                                    }}
                                    className="hover:bg-blue-50"
                                >
                                    {isSendingEmail ? 'Envoi en cours...' : 'Demande de paiement'}
                                </Button>
                            ) : (
                                <div className="text-sm text-gray-500 italic px-3 py-2 bg-gray-50 rounded-lg">
                                    {orderDetails.order.isProcessed ? 
                                        'Commande déjà traitée' : 
                                        'Aucune action disponible pour cette commande'
                                    }
                                </div>
                            )}
                        </div>

                        {/* Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Date de commande</div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarOutlined className="text-gray-400 text-sm" />
                                        <span className="text-gray-900 text-sm">
                                            {dayjs(orderDetails.order.createdAt).format('DD MMMM YYYY à HH:mm')}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Statut</div>
                                    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs"
                                        style={{
                                            backgroundColor: getStatusConfig(orderDetails.order.status).bgColor,
                                            color: getStatusConfig(orderDetails.order.status).color
                                        }}>
                                        {getStatusConfig(orderDetails.order.status).icon}
                                        <span className="font-medium ml-1">
                                            {getStatusConfig(orderDetails.order.status).label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Paiement</div>
                                    <div className="inline-flex items-center px-2 py-1 rounded-md text-xs"
                                        style={{
                                            backgroundColor: getPaymentStatusConfig(orderDetails.order.paymentStatus).bgColor,
                                            color: getPaymentStatusConfig(orderDetails.order.paymentStatus).color
                                        }}>
                                        <span className="font-medium">
                                            {getPaymentStatusConfig(orderDetails.order.paymentStatus).label}
                                        </span>
                                    </div>
                                </div>

                                {orderDetails.order.paymentMethod && (
                                    <div>
                                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Mode de paiement</div>
                                        <div className="flex items-center space-x-2">
                                            <DollarOutlined className="text-gray-400 text-sm" />
                                            <span className="text-gray-900 capitalize text-sm">
                                                {orderDetails.order.paymentMethod}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Info */}
                        {orderDetails.order.buyerId && (
                            <>
                                <Divider className="my-4" />
                                <div className="mb-6">
                                    <div className="text-base font-medium text-gray-900 mb-3 flex items-center">
                                        <UserOutlined className="mr-2 text-sm" />
                                        Informations Client
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <Text className="text-white text-xs font-semibold">
                                                    {(orderDetails.order.buyerId.fullName || orderDetails.order.buyerId.socialReason || '').charAt(0).toUpperCase()}
                                                </Text>
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {orderDetails.order.buyerId.fullName || orderDetails.order.buyerId.socialReason}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {orderDetails.order.buyerId.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <PhoneOutlined className="text-gray-400" />
                                                <span>{orderDetails.order.buyerId.phoneNumber || 'Non renseigné'}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MailOutlined className="text-gray-400" />
                                                <span>{orderDetails.order.buyerId.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Order Items */}
                        <div className="mb-6">
                            <div className="text-base font-medium text-gray-900 mb-3 flex items-center">
                                <FileTextOutlined className="mr-2 text-sm" />
                                Détails de la commande
                            </div>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orderDetails.orderItems.map((item) => (
                                            <tr key={item._id}>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center space-x-3">
                                                        {item.productId.image ? (
                                                            <Image
                                                                src={item.productId.image}
                                                                alt={item.productId.name}
                                                                width={40}
                                                                height={40}
                                                                className="rounded-md object-cover"
                                                                preview={false}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                                                                <BoxPlotOutlined className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-sm text-gray-900">
                                                                {item.productId.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {item.productId.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-900">
                                                        {item.supplierId?.name || item.supplierId?.socialReason || 'Inconnu'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-900">
                                                    {formatPrice(item.unitPrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm text-gray-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                                    {formatPrice(item.totalPrice)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                                                Total
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                                                {formatPrice(orderDetails.order.totalAmount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Notes */}
                        {orderDetails.order.notes && (
                            <div className="mb-6">
                                <div className="text-base font-medium text-gray-900 mb-3 flex items-center">
                                    <FileTextOutlined className="mr-2 text-sm" />
                                    Notes
                                </div>
                                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm text-gray-700">
                                    {orderDetails.order.notes}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Impossible de charger les détails de la commande"
                    />
                )}
            </Modal>
        </div>
    );
};

export default AdminOrders;