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
    message
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
    CheckCircleOutlined
} from '@ant-design/icons';
import { useGetSalesQuery } from '../../services/api';
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

interface UserSalesProps {
    userId?: string; // Si pas fourni, prend celui du localStorage
    showAllUsers?: boolean; // Pour admin qui veut voir toutes les ventes
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
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Si pas d'userId fourni, prendre celui du localStorage
    const effectiveUserId = userId || localStorage.getItem('userId') || '';

    const {
        data: salesData,
        isLoading,
        error,
        refetch
    } = useGetSalesQuery({
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

    const sales = salesData?.data || [];
    const pagination = salesData?.pagination;

    // Statistiques rapides
    const stats = React.useMemo(() => {
        if (!sales.length) return { total: 0, pending: 0, completed: 0, totalAmount: 0 };
        
        return {
            total: sales.length,
            pending: sales.filter((s: Sale) => s.status === 'pending').length,
            completed: sales.filter((s: Sale) => s.status === 'completed').length,
            totalAmount: sales.reduce((sum: number, s: Sale) => sum + s.totalAmount, 0)
        };
    }, [sales]);

    // Status colors and labels
    const getStatusConfig = (status: string) => {
        const configs = {
            pending: { color: 'orange', label: 'En attente', icon: <ClockCircleOutlined /> },
            'pending-payment': { color: 'blue', label: 'En attente de paiement', icon: <DollarOutlined /> },
            completed: { color: 'green', label: 'Terminée', icon: <CheckCircleOutlined /> },
            delivered: { color: 'cyan', label: 'Livrée', icon: <CheckCircleOutlined /> },
            cancelled: { color: 'red', label: 'Annulée', icon: <ClockCircleOutlined /> },
        };
        return configs[status as keyof typeof configs] || configs.pending;
    };

    const getPaymentStatusConfig = (status: string) => {
        const configs = {
            pending: { color: 'orange', label: 'En attente' },
            paid: { color: 'green', label: 'Payée' },
            partial: { color: 'blue', label: 'Partiel' },
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
        setSelectedSale(sale);
        setDrawerVisible(true);
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
            title: 'N° Vente',
            dataIndex: 'saleNumber',
            key: 'saleNumber',
            width: 140,
            render: (text: string) => (
                <Text strong className="text-blue-600">{text}</Text>
            ),
            sorter: true,
        },
        ...(showAllUsers ? [{
            title: 'Client',
            dataIndex: 'buyerId',
            key: 'buyer',
            width: 200,
            render: (buyer: any) => (
                <div className="flex items-center space-x-2">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium text-sm">{buyer?.fullName || buyer?.socialReason}</div>
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
                <Text strong className="text-green-600">{formatPrice(amount)}</Text>
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
                    <Tag color={config.color} icon={config.icon}>
                        {config.label}
                    </Tag>
                );
            },
            filters: [
                { text: 'En attente', value: 'pending' },
                { text: 'En attente de paiement', value: 'pending-payment' },
                { text: 'Terminée', value: 'completed' },
                { text: 'Livrée', value: 'delivered' },
                { text: 'Annulée', value: 'cancelled' },
            ],
        },
        {
            title: 'Paiement',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 120,
            render: (status: string) => {
                const config = getPaymentStatusConfig(status);
                return <Tag color={config.color}>{config.label}</Tag>;
            },
            filters: [
                { text: 'En attente', value: 'pending' },
                { text: 'Payée', value: 'paid' },
                { text: 'Partiel', value: 'partial' },
            ],
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: string) => (
                <div>
                    <div className="text-sm">{dayjs(date).format('DD/MM/YYYY')}</div>
                    <div className="text-xs text-gray-500">{dayjs(date).format('HH:mm')}</div>
                </div>
            ),
            sorter: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record: Sale) => (
                <Space size="small">
                    <Tooltip title="Voir détails">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="w-full space-y-6">
            {/* En-tête et statistiques */}
            <Card className="shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <Title level={4} className="mb-2">
                            {showAllUsers ? 'Toutes les ventes' : 'Mes commandes'}
                        </Title>
                        <Text type="secondary">
                            Gérez et suivez vos {showAllUsers ? 'ventes' : 'commandes'}
                        </Text>
                    </div>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() => refetch()}
                        loading={isLoading}
                    >
                        Actualiser
                    </Button>
                </div>

                {/* Statistiques rapides */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={12} sm={6}>
                        <Card size="small" className="text-center bg-blue-50 border-blue-200">
                            <Statistic
                                title="Total"
                                value={stats.total}
                                prefix={<ShoppingCartOutlined className="text-blue-600" />}
                                valueStyle={{ color: '#1890ff', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" className="text-center bg-orange-50 border-orange-200">
                            <Statistic
                                title="En attente"
                                value={stats.pending}
                                prefix={<ClockCircleOutlined className="text-orange-600" />}
                                valueStyle={{ color: '#fa8c16', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" className="text-center bg-green-50 border-green-200">
                            <Statistic
                                title="Terminées"
                                value={stats.completed}
                                prefix={<CheckCircleOutlined className="text-green-600" />}
                                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card size="small" className="text-center bg-purple-50 border-purple-200">
                            <Statistic
                                title="Montant total"
                                value={formatPrice(stats.totalAmount)}
                                prefix={<DollarOutlined className="text-purple-600" />}
                                valueStyle={{ color: '#722ed1', fontSize: '16px' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filtres */}
                <Row gutter={[12, 12]} className="mb-4">
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Input
                            placeholder="Rechercher par numéro..."
                            prefix={<SearchOutlined />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Select
                            placeholder="Statut"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            allowClear
                            className="w-full"
                        >
                            <Option value="pending">En attente</Option>
                            <Option value="pending-payment">En attente paiement</Option>
                            <Option value="completed">Terminée</Option>
                            <Option value="delivered">Livrée</Option>
                            <Option value="cancelled">Annulée</Option>
                        </Select>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Select
                            placeholder="Paiement"
                            value={paymentStatusFilter}
                            onChange={setPaymentStatusFilter}
                            allowClear
                            className="w-full"
                        >
                            <Option value="pending">En attente</Option>
                            <Option value="paid">Payée</Option>
                            <Option value="partial">Partiel</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={3}>
                        <Button
                            icon={<FilterOutlined />}
                            onClick={clearFilters}
                            className="w-full"
                        >
                            Réinitialiser
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Tableau */}
            <Card className="shadow-sm">
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
                                description="Aucune vente trouvée"
                            />
                        ),
                    }}
                />
            </Card>

            {/* Drawer des détails */}
            <Drawer
                title={`Détails de la vente ${selectedSale?.saleNumber}`}
                width={600}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                className="[&_.ant-drawer-body]:p-0"
            >
                {selectedSale && (
                    <div className="space-y-6">
                        {/* Informations générales */}
                        <div className="p-6 border-b">
                            <Descriptions
                                title="Informations générales"
                                column={1}
                                size="small"
                            >
                                <Descriptions.Item label="Numéro">
                                    <Text strong>{selectedSale.saleNumber}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Date de création">
                                    {dayjs(selectedSale.createdAt).format('DD/MM/YYYY HH:mm')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Statut">
                                    <Tag color={getStatusConfig(selectedSale.status).color}>
                                        {getStatusConfig(selectedSale.status).label}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Paiement">
                                    <Tag color={getPaymentStatusConfig(selectedSale.paymentStatus).color}>
                                        {getPaymentStatusConfig(selectedSale.paymentStatus).label}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Montant total">
                                    <Text strong className="text-green-600 text-lg">
                                        {formatPrice(selectedSale.totalAmount)}
                                    </Text>
                                </Descriptions.Item>
                                {selectedSale.notes && (
                                    <Descriptions.Item label="Notes">
                                        {selectedSale.notes}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </div>

                        {/* Client (si showAllUsers) */}
                        {showAllUsers && selectedSale.buyerId && (
                            <div className="p-6 border-b">
                                <Title level={5} className="mb-4">Informations client</Title>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Nom">
                                        {selectedSale.buyerId.fullName || selectedSale.buyerId.socialReason}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Email">
                                        {selectedSale.buyerId.email}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Téléphone">
                                        {selectedSale.buyerId.phoneNumber}
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        )}

                        {/* Articles */}
                        <div className="p-6">
                            <Title level={5} className="mb-4">Articles commandés</Title>
                            <div className="space-y-3">
                                {selectedSale.items?.map((item: SaleItem) => (
                                    <div key={item._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                            {item.productId?.image ? (
                                                <img
                                                    src={`${import.meta.env.VITE_BASE_WITHOUT_ORIGIN}/${item.productId.image}`}
                                                    alt={item.productId.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <FileTextOutlined className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">
                                                {item.productId?.name || item.productId?.designation}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {formatPrice(item.unitPrice)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {formatPrice(item.totalPrice)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default BuyerSales;