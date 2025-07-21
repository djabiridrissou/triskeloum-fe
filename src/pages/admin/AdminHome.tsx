import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    FiUsers,
    FiPackage,
    FiShoppingCart,
    FiDollarSign,
    FiAlertTriangle
} from 'react-icons/fi';
import { FaBoxOpen, FaChartLine } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { useGetDashboardDataQuery } from '../../services/api';
import Loading from '../../components/Loading';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminHome: React.FC = () => {
    const { data, isLoading, isError, error } = useGetDashboardDataQuery({});

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        /*  return <ErrorMessage 
           message="Échec du chargement des données du dashboard" 
           error={error} 
           fullScreen 
         />; */
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <FiAlertTriangle className="text-red-500 text-6xl mb-4" />
                <p className="text-lg font-semibold text-gray-800 mb-2">Erreur lors du chargement des données du dashboard</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <FiAlertTriangle className="text-red-500 text-6xl mb-4" />
                <p className="text-lg font-semibold text-gray-800 mb-2">Erreur lors du chargement des données du dashboard</p>
            </div>
        );
    }

    // Préparer les données pour les graphiques
    const salesChartData = {
        labels: data.salesAnalytics?.dailySales?.map((item: any) => item.date),
        datasets: [
            {
                label: 'Ventes',
                data: data.salesAnalytics?.dailySales?.map((item: any) => item.totalSales),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.1,
            },
            {
                label: 'Nombre de ventes',
                data: data.salesAnalytics?.dailySales?.map((item: any) => item.count),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.1,
            },
        ],
    };

    const topProductsData = {
        labels: data.products?.topSelling?.map((item: any) => item.productName),
        datasets: [
            {
                label: 'Unités vendues',
                data: data.products?.topSelling?.map((item: any) => item.totalSold),
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord</h1>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FiPackage className="text-green-500" size={24} />}
                    title="Fournisseurs"
                    value={data?.data?.summary?.totalSuppliers}
                />
                <StatCard
                    icon={<FiUsers className="text-blue-500" size={24} />}
                    title="Revedeurs"
                    value={data?.data?.summary?.totalBuyers}
                />
                <StatCard
                    icon={<FaBoxOpen className="text-purple-500" size={24} />}
                    title="Produits"
                    value={data?.data?.summary?.totalProducts}
                />
                <StatCard
                    icon={<FiShoppingCart className="text-orange-500" size={24} />}
                    title="Ventes"
                    value={data?.data?.summary?.totalSales}
                />
                {/*   <StatCard
                    icon={<FiDollarSign className="text-yellow-500" size={24} />}
                    title="Valeur Stock"
                    value={`${data?.data?.summary?.inventoryValue.toLocaleString()} €`}
                /> */}
                {/*  <StatCard
                    icon={<FiPackage className="text-indigo-500" size={24} />}
                    title="Quantité Stock"
                    value={data?.data?.summary?.inventoryQuantity}
                /> */}
                {/*  <StatCard
                    icon={<GiPayMoney className="text-red-500" size={24} />}
                    title="Frais en Attente"
                    value={data?.data?.summary?.pendingRegistrationFees}
                /> */}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ChartCard
                    title="Activité des Ventes"
                    icon={<FaChartLine className="mr-2 text-blue-500" />}
                >
                    <Line
                        data={salesChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'top' } },
                        }}
                    />
                </ChartCard>

                <ChartCard title="Produits les Plus Vendus">
                    <Bar
                        data={topProductsData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: { y: { beginAtZero: true } },
                        }}
                    />
                </ChartCard>
            </div>

            {/* Tableaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TableCard
                    title="Produits en Rupture"
                    icon={<FiAlertTriangle className="mr-2 text-yellow-500" />}
                    columns={[
                        { header: 'Produit', accessor: 'productName' },
                        {
                            header: 'Stock Restant',
                            accessor: 'remainingQty',
                            render: (value: number) => (
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${value < 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {value}
                                </span>
                            )
                        }
                    ]}
                    data={data?.data?.products?.lowStock}
                />

                <TableCard
                    title="Dernières Ventes"
                    columns={[
                        {
                            header: 'Date',
                            accessor: 'createdAt',
                            render: (value: string) => new Date(value).toLocaleDateString()
                        },
                        {
                            header: 'Acheteur',
                            accessor: 'buyerId.socialReason',
                            render: (value: string) => value || 'N/A'
                        },
                        {
                            header: 'Montant',
                            accessor: 'totalAmount',
                            render: (value: number) => `${value.toLocaleString()}`
                        }
                    ]}
                    data={data?.data?.salesAnalytics?.recentSales}
                />
            </div>
        </div>
    );
};

// Composants réutilisables

interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    change?: number | null;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change = null }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">{icon}</div>
        </div>
        {change !== null && (
            <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                </span>
                <span className="ml-1 text-sm text-gray-500">vs mois dernier</span>
            </div>
        )}
    </div>
);

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            {icon}{title}
        </h2>
        <div className="h-80">
            {children}
        </div>
    </div>
);

interface TableCardProps {
    title: string;
    columns: Array<{
        header: string;
        accessor: string;
        render?: (value: any) => React.ReactNode;
    }>;
    data: any[];
    icon?: React.ReactNode;
}

const TableCard: React.FC<TableCardProps> = ({ title, columns, data, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
            {icon}{title}
        </h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data?.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => {
                                const value = column.accessor.split('.').reduce((o, i) => o?.[i], item);
                                return (
                                    <td
                                        key={colIndex}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {column.render ? column.render(value) : value}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default AdminHome;