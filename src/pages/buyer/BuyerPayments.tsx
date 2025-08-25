import React, { useState } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Select,
  DatePicker,
  Input,
  Tooltip,
  Empty,
  Badge,
  Progress,
  Statistic,
  Space,
  Divider
} from 'antd';
import {
  DollarOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  CalendarOutlined,
  FileTextOutlined,
  WalletOutlined,
  CreditCardOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useGetPaymentsQuery } from '../../services/api';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Payment {
  _id: string;
  saleId: {
    _id: string;
    saleNumber: string;
    totalAmount: number;
    status: string;
  };
  invoiceNumber: string;
  amountHT: number;
  amountTTC: number;
  taxRate: number;
  taxAmount: number;
  buyerId: {
    _id: string;
    email: string;
    phoneNumber: string;
    socialReason: string;
  };
  status: 'paid' | 'unpaid' | 'cancelled';
  paymentMethod: 'mix' | 'bank' | 'flooz';
  notes?: string;
  invoiceDate: string;
  createdAt: string;
  updatedAt: string;
  formattedInvoiceDate: string;
  daysSinceInvoice: number;
  isOverdue: boolean;
}

const BuyerPayments: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const {
    data: paymentsData,
    isLoading: isPaymentsLoading,
    refetch
  } = useGetPaymentsQuery({
    page: currentPage,
    limit: pageSize,
    status: statusFilter || undefined,
    paymentMethod: paymentMethodFilter || undefined,
    searchQuery: searchQuery || undefined,
    startDate: dateRange?.[0]?.toISOString(),
    endDate: dateRange?.[1]?.toISOString(),
  });

  const payments = paymentsData?.data || [];
  const stats = paymentsData?.stats;
  const pagination = paymentsData?.pagination;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      paid: {
        color: '#10B981',
        label: 'Payé',
        icon: <CheckCircleOutlined />,
        bgColor: '#D1FAE5'
      },
      unpaid: {
        color: '#F59E0B',
        label: 'En attente',
        icon: <ClockCircleOutlined />,
        bgColor: '#FEF3C7'
      },
      cancelled: {
        color: '#EF4444',
        label: 'Annulé',
        icon: <CloseCircleOutlined />,
        bgColor: '#FEE2E2'
      },
    };
    return configs[status as keyof typeof configs] || configs.unpaid;
  };

  const getPaymentMethodConfig = (method: string) => {
    const configs = {
      bank: { label: 'Virement', icon: <BankOutlined />, color: '#3B82F6' },
      flooz: { label: 'Flooz', icon: <WalletOutlined />, color: '#8B5CF6' },
      mix: { label: 'Mixte', icon: <CreditCardOutlined />, color: '#10B981' },
    };
    return configs[method as keyof typeof configs] || { label: method, icon: <DollarOutlined />, color: '#6B7280' };
  };

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentMethodFilter('');
    setSearchQuery('');
    setDateRange(null);
    setCurrentPage(1);
  };

  const columns: ColumnsType<Payment> = [
    {
      title: 'Facture',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 130,
      render: (text: string, record: Payment) => (
        <div className="space-y-1">
          <div className="font-mono text-sm font-medium text-gray-900">{text}</div>
          <div className="text-xs text-gray-500">
            {record.saleId?.saleNumber}
          </div>
        </div>
      ),
    },
    {
      title: 'Montants',
      key: 'amounts',
      width: 120,
      render: (_, record: Payment) => (
        <div className="text-right space-y-1">
          <div className="font-semibold text-gray-900 text-sm">
            {formatPrice(record.amountTTC)}
          </div>
          <div className="text-xs text-gray-500">
            HT: {formatPrice(record.amountHT)}
          </div>
          {record.taxAmount > 0 && (
            <div className="text-xs text-gray-500">
              TVA: {formatPrice(record.taxAmount)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      width: 100,
      render: (date: string, record: Payment) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {dayjs(date).format('DD/MM/YYYY')}
          </div>
          <div className="text-xs text-gray-500">
            il y a {record.daysSinceInvoice} jour{record.daysSinceInvoice > 1 ? 's' : ''}
          </div>
          {record.isOverdue && (
            <div className="text-xs text-red-600 flex items-center gap-1">

              En retard
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <div
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: config.bgColor, color: config.color }}
          >
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </div>
        );
      },
    },
    {
      title: 'Paiement',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: string) => {
        if (!method) return <Text className="text-gray-400">-</Text>;
        const config = getPaymentMethodConfig(method);
        return (
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: `${config.color}15`, color: config.color }}
            >
              {config.icon}
            </div>
            <Text className="text-sm">{config.label}</Text>
          </div>
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      render: (notes: string) => (
        notes ? (
          <Tooltip title={notes}>
            <div className="text-sm text-gray-600 truncate max-w-[120px]">
              {notes}
            </div>
          </Tooltip>
        ) : (
          <Text className="text-gray-400">-</Text>
        )
      ),
    },
  ];

  return (
    <div className="w-full space-y-6 bg-gray-50 min-h-screen p-6">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <Title level={3} className="mb-2 text-gray-900">
              Mes Paiements
            </Title>
            <Text className="text-gray-600">
              Suivez vos factures et paiements en temps réel
            </Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isPaymentsLoading}
            className="border-gray-300 hover:border-blue-500"
          >
            Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        {stats && (
          <Row gutter={[20, 20]} className="mb-6">
            <Col xs={12} sm={6}>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-700">
                      {stats.overview.total}
                    </div>
                    <div className="text-sm text-blue-600">Transaction(s)</div>
                  </div>
                  <FileTextOutlined className="text-2xl text-blue-500" />
                </div>
              </div>
            </Col>
           
            <Col xs={12} sm={6}>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-purple-700">
                      {formatPrice(stats.amounts.totalAmountTTC)}
                    </div>
                    <div className="text-sm text-purple-600">Montant total</div>
                  </div>
                  <DollarOutlined className="text-2xl text-purple-500" />
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Taux de paiement */}
        {stats && (
          <Card className="mb-6 bg-gray-50 border-0" bodyStyle={{ padding: '16px' }}>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <div className="text-center">
                  <Text className="text-gray-500 text-xs uppercase tracking-wide">
                    Taux de paiement
                  </Text>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.overview.paymentRate}%
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="text-center">
                  <Text className="text-gray-500 text-xs uppercase tracking-wide">
                    Facture moyenne
                  </Text>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    {formatPrice(stats.amounts.averageInvoice)}
                  </div>
                </div>
              </Col>
            </Row>
            <Progress
              percent={stats.overview.paymentRate}
              strokeColor="#10b981"
              className="mt-4"
            />
          </Card>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Rechercher une facture..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
            allowClear
          />
          <Select
            placeholder="Statut"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            className="min-w-[120px]"
          >
            <Option value="paid">Payé</Option>
            <Option value="unpaid">En attente</Option>
            <Option value="cancelled">Annulé</Option>
          </Select>
          <Select
            placeholder="Mode de paiement"
            value={paymentMethodFilter}
            onChange={setPaymentMethodFilter}
            allowClear
            className="min-w-[140px]"
          >
            <Option value="bank">Virement</Option>
            <Option value="flooz">Flooz</Option>
            <Option value="mix">Mixte</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder={['Date début', 'Date fin']}
            className="max-w-xs"
          />
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
        <Table<Payment>
          columns={columns}
          dataSource={payments}
          rowKey="_id"
          loading={isPaymentsLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: pagination?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} sur ${total} factures`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Aucune facture trouvée"
              />
            ),
          }}
          className="modern-table"
          rowClassName={(record) => record.isOverdue ? 'overdue-row' : ''}
        />
      </div>

      <style>{`
                .modern-table .ant-table-thead > tr > th {
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-bottom: 2px solid #e2e8f0;
                    font-weight: 600;
                    color: #334155;
                    font-size: 13px;
                }
                
                .modern-table .ant-table-tbody > tr:hover > td {
                    background: #f8fafc;
                }

                .modern-table .overdue-row > td {
                    background: #fef2f2;
                }

                .modern-table .overdue-row:hover > td {
                    background: #fecaca;
                }
                
                .ant-progress-bg {
                    border-radius: 4px;
                }
            `}</style>
    </div>
  );
};

export default BuyerPayments;