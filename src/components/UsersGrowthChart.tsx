// src/components/admin/UsersGrowthChart.tsx
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChartData {
    date: string;
    count: number;
}

interface UsersGrowthChartProps {
    data: ChartData[];
}

const UsersGrowthChart: React.FC<UsersGrowthChartProps> = ({ data }) => {
    const formattedData = data.map(item => ({
        ...item,
        formattedDate: format(new Date(item.date), 'dd MMM', { locale: fr })
    }));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Évolution des inscriptions
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="formattedDate" 
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Nouveaux utilisateurs"
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UsersGrowthChart;