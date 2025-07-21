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
    BoxPlotOutlined
} from '@ant-design/icons';
import { useGetOrdersQuery, useGetOrderDetailsQuery } from '../../services/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

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
            pending: { color: '#F59E0B', label: 'En attente', icon: <ClockCircleOutlined />, bgColor: '#FEF3C7' },
            'pending-payment': { color: '#3B82F6', label: 'En attente de paiement', icon: <DollarOutlined />, bgColor: '#DBEAFE' },
            completed: { color: '#10B981', label: 'Terminée', icon: <CheckCircleOutlined />, bgColor: '#D1FAE5' },
            delivered: { color: '#06B6D4', label: 'Livrée', icon: <CheckCircleOutlined />, bgColor: '#CFFAFE' },
            cancelled: { color: '#EF4444', label: 'Annulée', icon: <ClockCircleOutlined />, bgColor: '#FEE2E2' },
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
                <div>
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
                    {/* <Button
                        size="small"
                        onClick={() => handleViewDetails(record)}
                        className="border border-yellow-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-md"
                        style={{
                            borderColor: '#facc15',       // yellow-400
                            color: '#ca8a04',             // yellow-600
                            backgroundColor: '#fefce8'    // yellow-50 (très clair)
                        }}

                    >
                        Marquer comme payé
                    </Button> */}
                </div>

            ),
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

            {/* Modal des détails - Design luxueux */}
            <Modal
                title={null}
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
                className="luxury-modal"
                style={{ top: 20 }}
            >
                {isLoadingDetails ? (
                    <div className="p-8">
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </div>
                ) : orderDetails ? (
                    <div className="bg-white">
                        {/* En-tête du modal */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 -m-6 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-75 mb-1">Commande</div>
                                    <div className="text-2xl font-light tracking-wide">
                                        {orderDetails.order.saleNumber}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-75 mb-1">Montant Total</div>
                                    <div className="text-2xl font-light">
                                        {formatPrice(orderDetails.order.totalAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations principales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Date de commande</div>
                                    <div className="flex items-center space-x-2">
                                        <CalendarOutlined className="text-gray-400" />
                                        <span className="text-gray-900">
                                            {dayjs(orderDetails.order.createdAt).format('DD MMMM YYYY à HH:mm')}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Statut</div>
                                    <div className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg"
                                        style={{
                                            backgroundColor: getStatusConfig(orderDetails.order.status).bgColor,
                                            color: getStatusConfig(orderDetails.order.status).color
                                        }}>
                                        {getStatusConfig(orderDetails.order.status).icon}
                                        <span className="font-medium">
                                            {getStatusConfig(orderDetails.order.status).label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Paiement</div>
                                    <div className="inline-flex items-center px-3 py-2 rounded-lg"
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
                                        <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Mode de paiement</div>
                                        <div className="flex items-center space-x-2">
                                            <DollarOutlined className="text-gray-400" />
                                            <span className="text-gray-900 capitalize">
                                                {orderDetails.order.paymentMethod}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informations client (si admin) */}
                        {showAllUsers && orderDetails.order.buyerId && (
                            <>
                                <Divider className="my-8" />
                                <div className="mb-8">
                                    <div className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <UserOutlined className="mr-2" />
                                        Informations Client
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <Text className="text-white font-semibold">
                                                    {(orderDetails.order.buyerId.fullName || orderDetails.order.buyerId.socialReason || '').charAt(0).toUpperCase()}
                                                </Text>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {orderDetails.order.buyerId.fullName || orderDetails.order.buyerId.socialReason}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center space-x-4">
                                                    <span className="flex items-center">
                                                        <MailOutlined className="mr-1" />
                                                        {orderDetails.order.buyerId.email}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <PhoneOutlined className="mr-1" />
                                                        {orderDetails.order.buyerId.phoneNumber}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Articles commandés */}
                        <Divider className="my-8" />
                        <div>
                            <div className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                                <BoxPlotOutlined className="mr-2" />
                                Articles Commandés
                                <Badge count={orderDetails.orderItems?.length || 0} className="ml-2" />
                            </div>
                            <div className="space-y-4">
                                {orderDetails.orderItems?.map((item: SaleItem, index: number) => (
                                    <div key={item._id}
                                        className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                {item.productId?.image ? (
                                                    <Image
                                                        src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${item.productId.image}`}
                                                        alt={item.productId.name}
                                                        className="w-full h-full object-cover"
                                                        preview={false}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FileTextOutlined className="text-2xl text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="font-medium text-gray-900 text-lg">
                                                                {item.productId?.name || item.productId?.designation}
                                                            </div>
                                                            {item.supplierId && (
                                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                    <ShopOutlined className="mr-1" />
                                                                    {item.supplierId.name || item.supplierId.socialReason}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <div className="flex items-center space-x-1">
                                                                <TagOutlined className="text-gray-400" />
                                                                <span className="text-gray-600">Prix unitaire:</span>
                                                                <span className="font-medium">{formatPrice(item.unitPrice)}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <BoxPlotOutlined className="text-gray-400" />
                                                                <span className="text-gray-600">Quantité:</span>
                                                                <span className="font-medium">{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-xl font-semibold text-gray-900">
                                                            {formatPrice(item.totalPrice)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatPrice(item.unitPrice)} × {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total final */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-lg font-medium text-gray-900">Total de la commande</div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatPrice(orderDetails.order.totalAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {orderDetails.order.notes && (
                            <>
                                <Divider className="my-8" />
                                <div>
                                    <div className="text-lg font-medium text-gray-900 mb-4">Notes</div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <Text className="text-amber-800">{orderDetails.order.notes}</Text>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <Empty description="Aucun détail trouvé" />
                    </div>
                )}
            </Modal>

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