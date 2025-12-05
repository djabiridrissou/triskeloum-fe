// src/components/admin/StatsGrid.tsx
import React from 'react';
import KPICard from './KPICard';
import { 
    UsersIcon, 
    AcademicCapIcon, 
    ChatBubbleLeftRightIcon,
    ChartBarIcon 
} from '@heroicons/react/24/outline';
import { DashboardKPIs } from '../utils/typeDef';


interface StatsGridProps {
    kpis: DashboardKPIs;
}

const StatsGrid: React.FC<StatsGridProps> = ({ kpis }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
                title="Utilisateurs totaux"
                value={kpis.totalUsers.toLocaleString()}
                subtitle={`+${kpis.newUsersWeek} cette semaine`}
                icon={<UsersIcon className="w-8 h-8 text-white" />}
                trend={{
                    value: kpis.usersGrowth,
                    isPositive: parseFloat(kpis.usersGrowth) > 0
                }}
                color="blue"
            />
            
            <KPICard
                title="Cours disponibles"
                value={kpis.totalCourses}
                subtitle={`${kpis.publishedCourses} publiés`}
                icon={<AcademicCapIcon className="w-8 h-8 text-white" />}
                color="green"
            />
            
            <KPICard
                title="Messages"
                value={kpis.messagesToday}
                subtitle={`${kpis.messagesWeek} cette semaine`}
                icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />}
                color="purple"
            />
            
            <KPICard
                title="Utilisateurs actifs"
                value={kpis.activeUsers}
                subtitle={`${kpis.activeUsersPercentage}% du total`}
                icon={<ChartBarIcon className="w-8 h-8 text-white" />}
                color="orange"
            />
        </div>
    );
};

export default StatsGrid;