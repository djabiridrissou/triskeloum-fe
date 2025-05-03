import { useGetStudentsQuery } from "../../services/api";
import { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const Students = () => {
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const { data, isLoading } = useGetStudentsQuery({
        page: pagination.current,
        limit: pagination.pageSize,
        searchQuery: searchText,
    });

    useEffect(() => {
        if (data && data.pagination) {
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total
            }));
        }
    }, [data]);

    const handleTableChange = (pagination: any) => {
        setPagination({
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total
        });
    };

    const handleSearch = (value: any) => {
        setSearchText(value);
        setPagination(prev => ({
            ...prev,
            current: 1
        }));
    };   

    const columns = [
        {
            title: 'Student Number',
            dataIndex: 'studentNumber',
            key: 'studentNumber',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            render: (name: any) =>
                name
                    .split('.')
                    .map((part: any) => part.trim().charAt(0).toUpperCase() + part.trim().slice(1))
                    .join('. '),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Department',
            dataIndex: ['departmentId', 'name'],
            key: 'departmentName',
            render: (name: any) =>
                name
                    ?.split('.')
                    .map((part: any) => part.trim().charAt(0).toUpperCase() + part.trim().slice(1))
                    .join('. '),
        },
        {
            title: 'Current Level',
            dataIndex: ['currentLevelId', 'name'],
            key: 'levelName',
            render: (name: any) =>
                name
                    ?.split('.')
                    .map((part: any) => part.trim().charAt(0).toUpperCase() + part.trim().slice(1))
                    .join('. '),
        },
        {
            title: 'Creation Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: any) => moment(date).format('DD MMM, YYYY'),
            sorter: true,
        },
        {
            title: 'Updated Date',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: any) => moment(date).format('DD MMM, YYYY'),
            sorter: true,
        }
    ];

    return (
        <div className="p-4">

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <Input
                        placeholder="Search......."
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={data?.data || []}
                    rowKey="_id"
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} students`,
                    }}
                    loading={isLoading}
                    onChange={handleTableChange}
                />
            </div>
        </div>
    );
};

export default Students;