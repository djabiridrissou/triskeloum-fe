// src/pages/admin/Dashboard.tsx
import React from 'react';
import { KPICardSkeleton, ChartSkeleton, TableSkeleton } from '../components/LoadingSkeleton';
import RecentUsersTable from '../components/RecentUsersTable';
import StatsGrid from '../components/StatGrid';
import TopCoursesTable from '../components/TopCoursesTable';
import UsersByLevelChart from '../components/UsersByLevelChart';
import UsersGrowthChart from '../components/UsersGrowthChart';
import { useGetDashboardOverviewQuery, useGetUsersGrowthChartQuery, useGetUsersByLevelQuery, useGetRecentActivityQuery } from '../services/api';



const Dashboard: React.FC = () => {
    // ✅ Fetch data
    const { data: overviewData, isLoading: isLoadingOverview } = useGetDashboardOverviewQuery();
    const { data: growthData, isLoading: isLoadingGrowth } = useGetUsersGrowthChartQuery(30);
    const { data: levelData, isLoading: isLoadingLevel } = useGetUsersByLevelQuery();
    const { data: activityData, isLoading: isLoadingActivity } = useGetRecentActivityQuery(10);

    return (
        <div className="max-w-8xl mx-2 px-6 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                    <p className="text-gray-600 mt-1">
                        Vue d'ensemble de votre plateforme
                    </p>
                </div>
                <div className="text-sm text-gray-500">
                    Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}
                </div>
            </div>

            {/* KPIs */}
            {isLoadingOverview ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <KPICardSkeleton key={i} />
                    ))}
                </div>
            ) : overviewData?.payload?.kpis ? (
                <StatsGrid kpis={overviewData.payload.kpis} />
            ) : null}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoadingGrowth ? (
                    <ChartSkeleton />
                ) : growthData?.payload ? (
                    <UsersGrowthChart data={growthData.payload} />
                ) : null}

                {isLoadingLevel ? (
                    <ChartSkeleton />
                ) : levelData?.payload ? (
                    <UsersByLevelChart data={levelData.payload} />
                ) : null}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                {isLoadingActivity ? (
                    <TableSkeleton />
                ) : activityData?.payload?.users ? (
                    <RecentUsersTable users={activityData.payload.users} />
                ) : null}

                {/* Top Courses */}
                {isLoadingOverview ? (
                    <TableSkeleton />
                ) : overviewData?.payload?.topCourses ? (
                    <TopCoursesTable courses={overviewData.payload.topCourses} />
                ) : null}
            </div>
        </div>
    );
};

export default Dashboard;