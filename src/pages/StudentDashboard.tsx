import { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Input,
    DatePicker,
    Button,
    Row,
    Col,
    Tooltip,
    Image
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    CalendarOutlined,
    BulbOutlined,
    BulbFilled
} from '@ant-design/icons';
import { useGetStudentsAdvertisementsQuery } from '../services/api';
import SideModal from '../components/SideModal';
import AdvertisementForm from './sections/AddAdvertisement';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface SearchParams {
    page: number;
    limit: number;
    searchQuery?: string;
    type?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    startDate?: string | null;
    endDate?: string | null;
    location?: string;
}



const StudentDashboard = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState<SearchParams>({
        page: 1,
        limit: 10,
        searchQuery: '',
        sortField: 'createdAt',
        sortOrder: 'desc',
        startDate: null,
        endDate: null,
    });
    const [searchInput, setSearchInput] = useState('');
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const {
        data: advertisementsData,
        isLoading,
        refetch
    } = useGetStudentsAdvertisementsQuery(searchParams);

    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [tableLoading, setTableLoading] = useState<boolean>(true);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    // Get base URL from environment variable
    const baseUrl = import.meta.env.VITE_BASE_WITHOUT_ORIGIN || '';

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setTableLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setTableLoading(true);
        }
    }, [isLoading]);

    // Appliquer le thème à l'élément HTML
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (darkMode) {
            htmlElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // Debounce pour la recherche
    const debouncedSearch = (value: any) => {
        setSearchParams(prev => ({
            ...prev,
            searchQuery: value,
            page: 1
        }));
    };

    const handleSearchInputChange = (e: any) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSearch(value);
    };

    const handleTableChange = (
        pagination: any,
        filters: any,
        sorter: any
    ) => {
        setSearchParams(prev => ({
            ...prev,
            page: pagination.current,
            limit: pagination.pageSize,
            type: filters.type?.[0],
            location: filters.location?.[0],
            sortField: sorter.field || 'createdAt',
            sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
        }));
    };

    // @ts-ignore
    const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
        setSearchParams(prev => ({
            ...prev,
            startDate: dateStrings[0] || null,
            endDate: dateStrings[1] || null,
            page: 1
        }));
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    // @ts-ignore
    const handleAddAdvertisementSuccess = (updatedAd: any) => {
        Swal.fire({
            title: 'Success',
            text: 'Advertisement added successfully',
            icon: 'success',
            confirmButtonText: 'OK'
        })
        refetch();
        setIsAddModalOpen(false);
    };



    // Function to truncate text with ellipsis
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getMediaPreview = (media: string[]) => {
        if (!media || media.length === 0) return 'No media';

        const firstMedia = media[0];
        const cleanedUrl = firstMedia.replace(/^\/+/, '');
        const completeUrl = `${baseUrl}/${cleanedUrl}`;
        const fileExtension = cleanedUrl.split('.').pop()?.toLowerCase();
        const isImage = ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension || '');

        return (
            <div style={{ width: '100px', height: '60px', display: 'flex', alignItems: 'center' }}>
                {isImage ? (
                    <Image
                        src={completeUrl}
                        alt="Media preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                        preview={{
                            src: completeUrl,
                        }}
                    />
                ) : (
                    <video
                        src={completeUrl}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                    />
                )}
                {media.length > 1 && (
                    <span style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}>
                        +{media.length - 1}
                    </span>
                )}
            </div>
        );
    };

    const columns: any = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: true,
            responsive: ['sm'],
            ellipsis: true,
            width: '18%',
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="table-cell-content">{text}</span>
                </Tooltip>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Event', value: 'event' },
                { text: 'Service', value: 'service' },
                { text: 'Promotion', value: 'promotion' },
            ],
            responsive: ['md'],
            width: '12%',
            render: (type: string) => (
                <span className={`type-badge ${type.toLowerCase()}`}>{type}</span>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            responsive: ['lg'],
            width: '20%',
            render: (text: string) => (
                <Tooltip title={text} placement="topLeft" overlayStyle={{ maxWidth: '300px' }}>
                    <span className="description-cell">{truncateText(text, 30)}</span>
                </Tooltip>
            )
        },
        {
            title: 'Media',
            dataIndex: 'media',
            key: 'media',
            width: '15%',
            render: (media: string[]) => getMediaPreview(media),
            responsive: ['sm'],
        },
        {
            title: 'Scheduled date',
            dataIndex: 'date',
            key: 'date',
            sorter: true,
            width: '12%',
            render: (date: string) =>
                date ? (
                    <span className="date-cell">
                        {new Date(date).toLocaleString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false // ou true pour format AM/PM
                        })}
                    </span>
                ) : 'N/A',
            responsive: ['md'],
        },

        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            ellipsis: true,
            filters: [
                { text: 'Accra', value: 'Accra' },
                { text: 'Kumasi', value: 'Kumasi' },
            ],
            width: '15%',
            responsive: ['lg'],
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="location-cell">{text}</span>
                </Tooltip>
            )
        },
        /* {
            title: 'Actions',
            key: 'actions',
            width: '12%',
            render: (_: any, record: Advertisement) => (
                <Space size="middle" className="action-buttons">
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="link"
                            className="edit-button"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            icon={<DeleteOutlined />}
                            type="link"
                            danger
                            className="delete-button"
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        }, */
    ];

    return (
        <div className={`dashboard-container mx-auto px-4 max-w-screen-3xl ${darkMode ? 'dark-theme' : ''}`}>
            <div className="dashboard-header py-6 flex justify-between items-center">
                <Title onClick={() => navigate('/')} level={2} className="cursor-pointer dashboard-title text-2xl md:text-3xl">
                    Advertisement
                </Title>
                <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                    <Button
                        type="text"
                        icon={darkMode ? <BulbFilled /> : <BulbOutlined />}
                        onClick={toggleTheme}
                        className="theme-toggle-btn"
                        size="large"
                    />
                </Tooltip>
            </div>

            <Row gutter={[12, 12]} className="filter-row mb-6">
                <Col xs={24} md={12} lg={8}>
                    <Input
                        placeholder="Search advertisements"
                        allowClear
                        prefix={<SearchOutlined />}
                        className="w-full"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                        size="large"
                    />
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <RangePicker
                        className="w-full"
                        size="large"
                        format="YYYY-MM-DD"
                        placeholder={['Start Date', 'End Date']}
                        onChange={handleDateRangeChange}
                        suffixIcon={<CalendarOutlined />}
                    />
                </Col>
                <Col xs={24} lg={8} className="flex justify-end">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full md:w-auto"
                        size="large"
                    >
                        Add Advertisement
                    </Button>
                </Col>
            </Row>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={advertisementsData?.data || []}
                    loading={tableLoading}
                    pagination={{
                        current: advertisementsData?.pagination?.page || 1,
                        pageSize: advertisementsData?.pagination?.limit || 10,
                        total: advertisementsData?.pagination?.total || 0,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        className: 'px-4 py-2'
                    }}
                    onChange={handleTableChange}
                    rowKey="_id"
                    scroll={{ x: 'max-content' }}
                    className="w-full"
                    rowClassName="hover:bg-gray-50"
                />
            </div>

            <SideModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            >
                <AdvertisementForm
                    studentId={userData?._id || ''}
                    onSubmitSuccess={handleAddAdvertisementSuccess}
                />
            </SideModal>
        </div>
    );
};

export default StudentDashboard;