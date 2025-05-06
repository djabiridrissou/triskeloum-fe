import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Tabs } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAdminLoginMutation, useLoginMutation, useTutorLoginMutation } from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [activeTab, setActiveTab] = useState('student');
    const navigate = useNavigate();
    const [login, { isLoading: isStudentLoading }] = useLoginMutation();
    const [tutorLogin, { isLoading: isTutorLoading }] = useTutorLoginMutation();
    const [adminLogin, { isLoading: isAdminLoading }] = useAdminLoginMutation();

    useEffect(() => {
       
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/");
        }
    }, []);

    const handleLogin = async (values: any, userType: string) => {
        try {
            let response;

            console.log(userType);
            
            switch(userType) {
                case 'student':
                    response = await login(values).unwrap();
                    break;
                case 'tutor':
                    response = await tutorLogin(values).unwrap();
                    break;
                case 'admin':
                    response = await adminLogin(values).unwrap();
                    break;
                default:
                    throw new Error('Invalid user type');
            }

            

            const { name, email, phoneNumber, _id, role } = response.data;
            localStorage.setItem("user", JSON.stringify({ name, email, phoneNumber, _id, role }));

            switch(role) {
                case "student":
                    navigate("/students/dashboard");
                    break;
                case "tutor":
                    navigate("/tutors/dashboard");
                    break;
                case "admin":
                   navigate("/admin/dashboard");
                    break;
                default:
                    Swal.fire({
                        title: "Error!",
                        text: "User role not found",
                        icon: "error",
                        confirmButtonText: "Try Again",
                    });
            }
        } catch (error) {
            console.error("Something went wrong:", error);
            Swal.fire({
                title: "Error!",
                text: (error as any).data?.error || "Login failed",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    const LoginForm = ({ userType }: { userType: string }) => {
        const [form] = Form.useForm();

        const onFinish = (values: any) => {
            handleLogin(values, userType);
        };

        const getButtonLoading = () => {
            switch(userType) {
                case 'student': return isStudentLoading;
                case 'tutor': return isTutorLoading;
                case 'admin': return isAdminLoading;
                default: return false;
            }
        };

        const getButtonText = () => {
            switch(userType) {
                case 'student': return 'Student Login';
                case 'tutor': return 'Tutor Login';
                case 'admin': return 'Admin Login';
                default: return 'Login';
            }
        };

        return (
            <Form 
                form={form}
                layout="vertical" 
                onFinish={onFinish}
                className="mt-4"
            >
                <Form.Item 
                    name="email" 
                    label="Email" 
                    rules={[{ 
                        required: true, 
                        message: "Please enter your email",
                        type: 'email'
                    }]}
                >
                    <Input 
                        prefix={<MailOutlined className="text-gray-400" />} 
                        placeholder="Enter your email" 
                    />
                </Form.Item>

                <Form.Item 
                    name="password" 
                    label="Password" 
                    rules={[{ 
                        required: true, 
                        message: "Please enter your password",
                        min: 6
                    }]}
                >
                    <Input.Password 
                        prefix={<LockOutlined className="text-gray-400" />} 
                        placeholder="Enter Your Password" 
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        loading={getButtonLoading()}
                    >
                        {getButtonText()}
                    </Button>
                </Form.Item>
            </Form>
        );
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="mb-4 flex justify-center">
                    <img src="/images/logob.png" alt="Logo" className="h-42" />
                </div>

                <h2 className="mb-6 text-center text-lg font-semibold text-gray-700">
                    Log in to get started
                </h2>

                <Tabs 
                    centered 
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                >
                    <Tabs.TabPane 
                        key="student" 
                        tab="Student"
                    >
                        <LoginForm userType="student" />
                    </Tabs.TabPane>
                    <Tabs.TabPane 
                        key="tutor" 
                        tab="Tutor"
                    >
                        <LoginForm userType="tutor" />
                    </Tabs.TabPane>
                    <Tabs.TabPane 
                        key="admin" 
                        tab="Administrator"
                    >
                        <LoginForm userType="admin" />
                    </Tabs.TabPane>
                </Tabs>

                <div className="flex justify-center text-sm mt-4">
                    {activeTab !== 'admin' && (
                        <a href="/portal" className="text-blue-600 hover:underline">
                            Don't have an account? Register
                        </a>
                    )}
                    {activeTab === 'admin' && (
                        <span className="text-gray-500">
                            Contact system administrator for access
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;