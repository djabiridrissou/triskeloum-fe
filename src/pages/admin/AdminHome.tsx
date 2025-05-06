import { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Input,
    Button,
    Tabs,
} from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import { useGetAdvertisementsQuery, useGetStudentsQuery, useGetTutorsQuery } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { TabPane } = Tabs;

interface SearchParams {
    page: number;
    limit: number;
    searchQuery?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    departmentId?: string;
    levelId?: string;
}


const AdminEducationDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    // @ts-ignore
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

    // Fetch data
    const [studentSearchInput, setStudentSearchInput] = useState('');
    const { data: studentData } = useGetStudentsQuery({
        searchQuery: studentSearchInput
    })

    const { data: advertsData } = useGetAdvertisementsQuery({});

    const { data: tutorsData } = useGetTutorsQuery({});

    // Apply theme
    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // Handler functions
    //const toggleTheme = () => setDarkMode(!darkMode);

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


    // Columns configuration
    const getColumns = (type: string) => {
        const baseColumns: any = [

            /* {
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
            }, */
        ];

        if (type === 'level') {
            baseColumns.splice(1, 0, {
                title: 'Department',
                dataIndex: 'departmentName',
                key: 'department',
                sorter: false,
                render: (text: string) => <span className="truncate">{text}</span> as any,
            });
        } else if (type === 'advertisements') {
            baseColumns.splice(1, 0,
                { title: 'Type', dataIndex: 'type', key: 'type', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Title', dataIndex: 'title', key: 'title', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Description', dataIndex: 'description', key: 'description', sorter: true, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Location', dataIndex: 'location', key: 'location', sorter: true, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Created By', dataIndex: ['adminId', 'name'], key: 'createdBy', sorter: true, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> }
            );
        } else if (type === 'student') {
            baseColumns.splice(1, 0,
                { title: 'Name', dataIndex: 'name', key: 'name', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
            );
        } else if (type === 'tutors') {
            baseColumns.splice(1, 0,
                { title: 'Name', dataIndex: 'name', key: 'name', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                { title: 'Email', dataIndex: 'email', key: 'email', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
                //{ title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', sorter: false, ellipsis: true, render: (text: string) => <span className="truncate">{text}</span> as any },
            );
        }

        return baseColumns;
    };

    return (
        <div className={`p-4 ${darkMode ? 'dark' : ''}`}>
            <div className="flex justify-between items-center mb-6">
                <Title level={3} className="!mb-0">Administration</Title>
                <Button
                    onClick={() => navigate('/login')}
                >Logout</Button>
            </div>

            <div>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane
                        tab={<span>Students</span>}
                        key="students"
                    >
                        <div className="mb-4 flex gap-4 w-[25%]">
                            <Input
                                placeholder="Search students"
                                prefix={<SearchOutlined />}
                                value={studentSearchInput}
                                onChange={(e) => {
                                    setStudentSearchInput(e.target.value);
                                    handleSearch('student', e.target.value);
                                }}
                                className='w-1/2'
                            />
                        </div>
                        <Table
                            columns={getColumns('student')}
                            dataSource={studentData?.data}
                            rowKey="_id"
                            onChange={(pagination, _, sorter) =>
                                handleTableChange('student', pagination, sorter)
                            }
                            pagination={studentData?.pagination}
                        />
                    </TabPane>

                    <TabPane
                        tab={<span>Advertisements</span>}
                        key="advertisements"
                    >
                        <div className="mb-4 flex gap-4 w-[25%]">
                            <Input
                                placeholder="Search advertisements"
                                prefix={<SearchOutlined />}
                                value={studentSearchInput}
                                onChange={(e) => {
                                    setStudentSearchInput(e.target.value);
                                    handleSearch('advertisements', e.target.value);
                                }}
                                className='w-1/2'
                            />
                        </div>
                        <Table
                            columns={getColumns('advertisements')}
                            dataSource={advertsData?.data}
                            rowKey="_id"
                            onChange={(pagination, _, sorter) =>
                                handleTableChange('advertisements', pagination, sorter)
                            }
                            pagination={studentData?.pagination}
                        />
                    </TabPane>

                    <TabPane
                        tab={<span>Tutors</span>}
                        key="tutors"
                    >
                        <div className="mb-4 flex gap-4 w-[25%]">
                            <Input
                                placeholder="Search tutors"
                                prefix={<SearchOutlined />}
                                value={studentSearchInput}
                                onChange={(e) => {
                                    setStudentSearchInput(e.target.value);
                                    handleSearch('tutors', e.target.value);
                                }}
                                className='w-1/2'
                            />
                        </div>
                        <Table
                            columns={getColumns('tutors')}
                            dataSource={tutorsData?.data}
                            rowKey="_id"
                            onChange={(pagination, _, sorter) =>
                                handleTableChange('tutors', pagination, sorter)
                            }
                            pagination={tutorsData?.pagination}
                        />
                    </TabPane>
                </Tabs>
            </div>

            {/*  <Tabs activeKey={activeTab} onChange={setActiveTab}>
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
            </Modal> */}
        </div>
    );
};

export default AdminEducationDashboard;