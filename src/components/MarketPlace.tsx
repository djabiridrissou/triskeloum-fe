import React, { useState } from 'react';
import {
    Input,
    Select,
    DatePicker,
    Pagination,
    Empty,
    Spin
} from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import { useGetAdvertisementsQuery } from '../services/api';
import AdvertisementCard from './AdvertisementCard';

const { RangePicker } = DatePicker;
const { Option } = Select;

const MarketplaceTab: React.FC = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        searchQuery: '',
        type: undefined,
        startDate: null,
        endDate: null,
        sortField: 'createdAt',
        sortOrder: 'desc'
    });

    const {
        data: advertisementsData = {
            data: [],
            pagination: { total: 0, page: 1, pages: 1, limit: 10 }
        },
        isLoading: loadingAdvertisements,
        error: advertisementError
    } = useGetAdvertisementsQuery(filters);

    const handleSearch = (value: string) => {
        setFilters(prev => ({
            ...prev,
            searchQuery: value,
            page: 1
        }));
    };

    const handleTypeFilter = (value: string) => {
        setFilters((prev: any) => ({
            ...prev,
            type: value || undefined,
            page: 1
        }));
    };

    const handleSortChange = (value: string) => {
        const [field, order] = value.split('|');
        setFilters(prev => ({
            ...prev,
            sortField: field,
            sortOrder: order
        }));
    };

    const handleDateRangeChange = (dates: any) => {
        setFilters(prev => ({
            ...prev,
            startDate: dates ? dates[0]?.toISOString() : null,
            endDate: dates ? dates[1]?.toISOString() : null,
            page: 1
        }));
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        setFilters(prev => ({
            ...prev,
            page,
            limit: pageSize || prev.limit
        }));
    };

    // Loading state
    if (loadingAdvertisements) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    // Error state
    if (advertisementError) {
        return (
            <div className="text-center text-red-500 py-6">
                Failed to load advertisements. Please try again later.
            </div>
        );
    }

    // Sorting dropdown menu
    const sortMenu = [
        { label: 'Newest First', value: 'createdAt|desc' },
        { label: 'Oldest First', value: 'createdAt|asc' },
        { label: 'Title A-Z', value: 'title|asc' },
        { label: 'Title Z-A', value: 'title|desc' }
    ];

    return (
        <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-8">
                {/* Search Input */}
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Search advertisements"
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                />

                {/* Type Filter */}
                <Select
                    placeholder="Type"
                    onChange={handleTypeFilter}
                    allowClear
                    style={{ width: 120 }}
                >
                    <Option value="event">Event</Option>
                    <Option value="service">Service</Option>
                    <Option value="product">Product</Option>
                </Select>

                <span></span>
                <RangePicker
                    onChange={handleDateRangeChange}
                    style={{ width: 250 }}
                />
                <span></span>

                <Select
                    placeholder="Sort"
                    onChange={handleSortChange}
                    style={{ width: 150 }}
                >
                    {sortMenu.map(item => (
                        <Option key={item.value} value={item.value}>
                            {item.label}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Advertisements Grid */}
            {advertisementsData.data.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <Empty description="No advertisements available" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {advertisementsData.data.map((ad: any) => (
                            <AdvertisementCard key={ad._id} advertisement={ad} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center">
                        <Pagination
                            current={advertisementsData.pagination.page}
                            total={advertisementsData.pagination.total}
                            pageSize={advertisementsData.pagination.limit}
                            onChange={handlePageChange}
                            showSizeChanger
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} advertisements`}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketplaceTab;