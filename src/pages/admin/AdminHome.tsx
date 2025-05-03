import { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Input,
    Space,
    Button,
    Modal,
    message,
    Tabs,
    Form,
    Select,
    Popconfirm
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SearchOutlined,
    BulbOutlined,
    BulbFilled,
    TeamOutlined,
    BankOutlined,
    ReadOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;




interface SearchParams {
    page: number;
    limit: number;
    searchQuery?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    departmentId?: string;
    levelId?: string;
}

// Mock API hooks
// @ts-ignore
const useGetDepartmentsQuery = (params: SearchParams) => {
    // @ts-ignore
    const [data, setData] = useState({
        data: [
            { _id: '1', name: 'Computer Science', code: 'CS', description: 'Computer Science Department', createdAt: '2023-01-01' },
            { _id: '2', name: 'Business Administration', code: 'BA', description: 'Business Administration Department', createdAt: '2023-01-02' },
        ],
        pagination: { page: 1, limit: 10, total: 2 }
    });
    return { data, isLoading: false, refetch: () => {} };
};

const useGetLevelsQuery = (params: SearchParams) => {
    // @ts-ignore
    const [data, setData] = useState({
        data: [
            { 
                _id: '1', 
                name: 'First Year', 
                department: params.departmentId || '1', 
                departmentName: 'Computer Science', 
                year: 1, 
                description: 'First year students', 
                createdAt: '2023-01-01' 
            },
        ],
        pagination: { page: 1, limit: 10, total: 1 }
    });
    return { data, isLoading: false, refetch: () => {} };
};

const useGetClassesQuery = (params: SearchParams) => {
    // @ts-ignore
    const [data, setData] = useState({
        data: [
            { 
                _id: '1', 
                name: 'CS101', 
                level: params.levelId || '1', 
                levelName: 'First Year', 
                department: '1', 
                departmentName: 'Computer Science', 
                capacity: 40, 
                description: 'Introduction to Programming', 
                createdAt: '2023-01-01' 
            },
        ],
        pagination: { page: 1, limit: 10, total: 1 }
    });
    return { data, isLoading: false, refetch: () => {} };
};

const AdminEducationDashboard = () => {
    const [activeTab, setActiveTab] = useState('departments');
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });
    
    const [departmentSearchParams, setDepartmentSearchParams] = useState<SearchParams>({
        page: 1,
        limit: 10,
    });
    
    const [levelSearchParams, setLevelSearchParams] = useState<SearchParams>({
        page: 1,
        limit: 10,
    });
    
    const [classSearchParams, setClassSearchParams] = useState<SearchParams>({
        page: 1,
        limit: 10,
    });
    
    // Modal states
    const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
    const [isAddLevelModalOpen, setIsAddLevelModalOpen] = useState(false);
    const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);
    
    // Form instances
    const [departmentForm] = Form.useForm();
    const [levelForm] = Form.useForm();
    const [classForm] = Form.useForm();
    
    // Search inputs
    const [departmentSearchInput, setDepartmentSearchInput] = useState('');
    const [levelSearchInput, setLevelSearchInput] = useState('');
    const [classSearchInput, setClassSearchInput] = useState('');
    
    // Fetch data
    const { data: departmentsData } = useGetDepartmentsQuery(departmentSearchParams);
    const { data: levelsData } = useGetLevelsQuery(levelSearchParams);
    const { data: classesData } = useGetClassesQuery(classSearchParams);

    // Apply theme
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // Handler functions
    const toggleTheme = () => setDarkMode(!darkMode);

    const handleSearch = (type: string, value: string) => {
        const params = { 
            ...(type === 'department' ? departmentSearchParams : 
                type === 'level' ? levelSearchParams : classSearchParams),
            searchQuery: value,
            page: 1
        };
        
        if (type === 'department') {
            setDepartmentSearchParams(params);
        } else if (type === 'level') {
            setLevelSearchParams(params);
        } else {
            setClassSearchParams(params);
        }
    };

    const handleTableChange = (type: string, pagination: any, sorter: any) => {
        const params: any = {
            ...(type === 'department' ? departmentSearchParams : 
                type === 'level' ? levelSearchParams : classSearchParams),
            page: pagination.current,
            limit: pagination.pageSize,
            sortField: sorter.field,
            sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc'
        };
        
        if (type === 'department') {
            setDepartmentSearchParams(params);
        } else if (type === 'level') {
            setLevelSearchParams(params);
        } else {
            setClassSearchParams(params);
        }
    };

    // @ts-ignore
    const handleFormSubmit = async (values: any, type: string) => {
        try {
            // Ici vous feriez normalement un appel API pour créer/mettre à jour
            message.success(`${type} ${currentItem ? 'updated' : 'added'} successfully`);
            
            if (type === 'department') {
                setIsAddDepartmentModalOpen(false);
                departmentForm.resetFields();
            } else if (type === 'level') {
                setIsAddLevelModalOpen(false);
                levelForm.resetFields();
            } else {
                setIsAddClassModalOpen(false);
                classForm.resetFields();
            }
            
            if (isEditModalOpen) {
                setIsEditModalOpen(false);
                setCurrentItem(null);
            }
        } catch (error) {
            message.error(`Failed to ${currentItem ? 'update' : 'add'} ${type}`);
        }
    };

    // Columns configuration
    const getColumns = (type: string) => {
        const baseColumns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: true,
                ellipsis: true,
                render: (text: string) => <span className="truncate">{text}</span>
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
                render: (text: string) => <span className="truncate">{text}</span>
            },
            {
                title: 'Created At',
                dataIndex: 'createdAt',
                key: 'createdAt',
                sorter: true,
                render: (date: string) => new Date(date).toLocaleDateString()
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_: any, record: any) => (
                    <Space size="middle">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => {
                                setCurrentItem(record);
                                if (type === 'department') {
                                    departmentForm.setFieldsValue(record);
                                } else if (type === 'level') {
                                    levelForm.setFieldsValue(record);
                                } else {
                                    classForm.setFieldsValue(record);
                                }
                                setIsEditModalOpen(true);
                            }}
                        />
                        <Popconfirm
                            title={`Delete this ${type}?`}
                            onConfirm={() => message.success(`${type} deleted`)}
                        >
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        if (type === 'level') {
            baseColumns.splice(1, 0,{
                title: 'Department',
                dataIndex: 'departmentName',
                key: 'department',
                sorter: false,
                render: (text: string) => <span className="truncate">{text}</span> as any,
              });
        } else if (type === 'class') {
            baseColumns.splice(1, 0, 
                { title: 'Department', dataIndex: 'departmentName', key: 'department', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
{ title: 'Level', dataIndex: 'levelName', key: 'level', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
{ title: 'Capacity', dataIndex: 'capacity', key: 'capacity', sorter: true, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any }
            );
        }

        return baseColumns;
    };

    return (
        <div className={`p-4 ${darkMode ? 'dark' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <Title level={2} className="!mb-0">Education Management</Title>
                <Button 
                    icon={darkMode ? <BulbFilled /> : <BulbOutlined />} 
                    onClick={toggleTheme}
                />
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane 
                    tab={<span><BankOutlined /> Departments</span>} 
                    key="departments"
                >
                    <div className="mb-4 flex gap-4">
                        <Input
                            placeholder="Search departments"
                            prefix={<SearchOutlined />}
                            value={departmentSearchInput}
                            onChange={(e) => {
                                setDepartmentSearchInput(e.target.value);
                                handleSearch('department', e.target.value);
                            }}
                        />
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddDepartmentModalOpen(true)}
                        >
                            Add Department
                        </Button>
                    </div>
                    <Table
                        columns={getColumns('department')}
                        dataSource={departmentsData?.data}
                        rowKey="_id"
                        onChange={(pagination, _, sorter) => 
                            handleTableChange('department', pagination, sorter)
                        }
                        pagination={departmentsData?.pagination}
                    />
                </TabPane>
                
                <TabPane 
                    tab={<span><TeamOutlined /> Levels</span>} 
                    key="levels"
                >
                    <div className="mb-4 flex gap-4">
                        <Input
                            placeholder="Search levels"
                            prefix={<SearchOutlined />}
                            value={levelSearchInput}
                            onChange={(e) => {
                                setLevelSearchInput(e.target.value);
                                handleSearch('level', e.target.value);
                            }}
                        />
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddLevelModalOpen(true)}
                        >
                            Add Level
                        </Button>
                    </div>
                    <Table
                        columns={getColumns('level')}
                        dataSource={levelsData?.data}
                        rowKey="_id"
                        onChange={(pagination, _, sorter) => 
                            handleTableChange('level', pagination, sorter)
                        }
                        pagination={levelsData?.pagination}
                    />
                </TabPane>
                
                <TabPane 
                    tab={<span><ReadOutlined /> Classes</span>} 
                    key="classes"
                >
                    <div className="mb-4 flex gap-4">
                        <Input
                            placeholder="Search classes"
                            prefix={<SearchOutlined />}
                            value={classSearchInput}
                            onChange={(e) => {
                                setClassSearchInput(e.target.value);
                                handleSearch('class', e.target.value);
                            }}
                        />
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddClassModalOpen(true)}
                        >
                            Add Class
                        </Button>
                    </div>
                    <Table
                        columns={getColumns('class')}
                        dataSource={classesData?.data}
                        rowKey="_id"
                        onChange={(pagination, _, sorter) => 
                            handleTableChange('class', pagination, sorter)
                        }
                        pagination={classesData?.pagination}
                    />
                </TabPane>
            </Tabs>

            {/* Department Modal */}
            <Modal
                title={`${currentItem ? 'Edit' : 'Add'} Department`}
                open={isAddDepartmentModalOpen || (isEditModalOpen && activeTab === 'departments')}
                onCancel={() => {
                    setIsAddDepartmentModalOpen(false);
                    setIsEditModalOpen(false);
                    departmentForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={departmentForm}
                    onFinish={(values) => handleFormSubmit(values, 'department')}
                    layout="vertical"
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>

            {/* Level Modal */}
            <Modal
                title={`${currentItem ? 'Edit' : 'Add'} Level`}
                open={isAddLevelModalOpen || (isEditModalOpen && activeTab === 'levels')}
                onCancel={() => {
                    setIsAddLevelModalOpen(false);
                    setIsEditModalOpen(false);
                    levelForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={levelForm}
                    onFinish={(values) => handleFormSubmit(values, 'level')}
                    layout="vertical"
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                        <Select>
                            {departmentsData?.data.map(dept => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>

            {/* Class Modal */}
            <Modal
                title={`${currentItem ? 'Edit' : 'Add'} Class`}
                open={isAddClassModalOpen || (isEditModalOpen && activeTab === 'classes')}
                onCancel={() => {
                    setIsAddClassModalOpen(false);
                    setIsEditModalOpen(false);
                    classForm.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={classForm}
                    onFinish={(values) => handleFormSubmit(values, 'class')}
                    layout="vertical"
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="department" label="Department" rules={[{ required: true }]}>
                        <Select onChange={() => classForm.setFieldsValue({ level: undefined })}>
                            {departmentsData?.data.map(dept => (
                                <Option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="level" label="Level" rules={[{ required: true }]}>
                        <Select>
                            {levelsData?.data.map(level => (
                                <Option key={level._id} value={level._id}>
                                    {level.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="capacity" label="Capacity" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminEducationDashboard;