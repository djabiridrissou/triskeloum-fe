import React, { useState } from "react";
import { 
    Form, 
    Input, 
    Button, 
    Select, 
    Tabs, 
    Typography, 
    Card, 
    InputNumber 
} from "antd";
import {
    MailOutlined,
    UserOutlined,
    PhoneOutlined,
    IdcardOutlined,
    BookOutlined,
    DollarOutlined
} from "@ant-design/icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// Shared interface for form values
interface BaseFormValues {
    name: string;
    email: string;
    phone: string;
    password?: string;
    confirmPassword?: string;
}

interface StudentFormValues extends BaseFormValues {
    studentNumber: string;
    department?: string;
    currentLevel?: string;
}

interface TutorFormValues extends BaseFormValues {
    hourPrice: number;
    courses: string[];
}

const CombinedRegister: React.FC = () => {
    const [studentForm] = Form.useForm();
    const [tutorForm] = Form.useForm();
    const [activeTab, setActiveTab] = useState<"student" | "tutor">("student");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    // Predefined list of courses for tutors
    const courseOptions = [
        "Mathematics", 
        "Physics", 
        "Chemistry", 
        "Biology", 
        "Computer Science", 
        "Programming", 
        "English", 
        "History", 
        "Geography"
    ];

    const handleSubmit = async (values: StudentFormValues | TutorFormValues, type: "student" | "tutor") => {
        setIsSubmitting(true);

        const reqBody = type === "student" 
            ? {
                name: values.name,
                email: values.email,
                phoneNumber: '233' + values.phone,
                studentNumber: (values as StudentFormValues).studentNumber,
                ...(values.password && { password: values.password })
            }
            : {
                name: values.name,
                email: values.email,
                phoneNumber: '233' + values.phone,
                hourPrice: (values as TutorFormValues).hourPrice,
                courses: JSON.stringify((values as TutorFormValues).courses || []),
                ...(values.password && { password: values.password })
            };

        try {
            localStorage.setItem("userPhone", '233' + values.phone);
            const endpoint = type === "student" 
                ? "/students/write" 
                : "/tutors/write";

            const response = await fetch(import.meta.env.VITE_BASE_URL + endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            });

            if (response.status === 200) {
                const data = await response.json();
                
                
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message,
                });
                if (type === "student") {
                    localStorage.setItem("userType", "student");
                } else {
                    localStorage.setItem("userType", "tutor");
                }
                navigate("/verify");
            } else {
                console.error("Error:", response);
                let error = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.error
                });
            }
        } catch (error: any) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Something went wrong',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 py-8">
            <Card
                className="w-full max-w-md rounded-lg shadow-lg"
                variant="outlined"
            >
                <Title level={3} className="text-center text-gray-700 mb-6">
                    Registration
                </Title>

                <Tabs 
                    activeKey={activeTab} 
                    onChange={(key) => setActiveTab(key as "student" | "tutor")}
                    centered
                >
                    <TabPane tab="Student" key="student">
                        <Form
                            layout="vertical"
                            form={studentForm}
                            onFinish={(values) => handleSubmit(values, "student")}
                            //requiredMark="optional"
                        >
                            {/* Student Registration Fields */}
                            {/* Personal Information Section */}
                            <div className="mb-4">
                                <Text strong className="text-gray-600">Personal Information</Text>
                            </div>

                            {/* Name */}
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: "Please enter your full name" }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="Enter your name"
                                />
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Please enter your email" },
                                    { type: "email", message: "Enter a valid email" },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-gray-400" />}
                                    placeholder="Enter your email"
                                />
                            </Form.Item>

                            {/* Phone Number */}
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[
                                    { required: true, message: "Please enter your phone number" },
                                    {
                                        pattern: /^[0-9]{9}$/,
                                        message: "Please enter 9 digits without country code",
                                    },
                                ]}
                                extra="Enter 9 digits without the country code"
                            >
                                <Input
                                    prefix={<PhoneOutlined className="text-gray-400" />}
                                    addonBefore="+233"
                                    placeholder="501234567"
                                    maxLength={9}
                                />
                            </Form.Item>

                            {/* Student Number */}
                            <Form.Item
                                name="studentNumber"
                                label="Student Number"
                                rules={[
                                    { required: true, message: "Please enter your student number" },
                                    {
                                        pattern: /^[A-Z0-9]+$/,
                                        message: "Student number should only contain uppercase letters and numbers"
                                    }
                                ]}
                            >
                                <Input
                                    prefix={<IdcardOutlined className="text-gray-400" />}
                                    placeholder="Enter student number"
                                />
                            </Form.Item>

                            {/* Optional Password */}
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { 
                                        min: 6, 
                                        message: "Password must be at least 6 characters long" 
                                    }
                                ]}
                            >
                                <Input.Password 
                                    placeholder="Enter at least 6 characters" 
                                    
                                />
                            </Form.Item>

                            {/* Submit Button */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 mt-4"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Registering..." : "Register as Student"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>

                    <TabPane tab="Tutor" key="tutor">
                        <Form
                            layout="vertical"
                            form={tutorForm}
                            onFinish={(values) => handleSubmit(values, "tutor")}
                            //requiredMark="optional"
                        >
                            {/* Tutor Registration Fields */}
                            {/* Personal Information Section */}
                            <div className="mb-4">
                                <Text strong className="text-gray-600">Personal Information</Text>
                            </div>

                            {/* Name */}
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: "Please enter your full name" }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="Enter your name"
                                />
                            </Form.Item>

                            {/* Email */}
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Please enter your email" },
                                    { type: "email", message: "Enter a valid email" },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-gray-400" />}
                                    placeholder="Enter your email"
                                />
                            </Form.Item>

                            {/* Phone Number */}
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[
                                    { required: true, message: "Please enter your phone number" },
                                    {
                                        pattern: /^[0-9]{9}$/,
                                        message: "Please enter 9 digits without country code",
                                    },
                                ]}
                                extra="Enter 9 digits without the country code"
                            >
                                <Input
                                    prefix={<PhoneOutlined className="text-gray-400" />}
                                    addonBefore="+233"
                                    placeholder="501234567"
                                    maxLength={9}
                                />
                            </Form.Item>

                            {/* Hourly Price */}
                            <Form.Item
                                name="hourPrice"
                                label="Hourly Rate (GHS)"
                                rules={[
                                    { 
                                        required: true, 
                                        message: "Please enter your hourly tutoring rate" 
                                    },
                                    {
                                        type: 'number',
                                        min: 1,
                                        message: "Hourly rate must be at least 1 GHS"
                                    }
                                ]}
                            >
                                <InputNumber
                                    prefix={<DollarOutlined className="text-gray-400" />}
                                    style={{ width: '100%' }}
                                    placeholder="Enter your hourly rate"
                                />
                            </Form.Item>

                            {/* Courses */}
                            <Form.Item
                                name="courses"
                                label="Courses You Can Tutor"
                                rules={[
                                    { 
                                        required: true, 
                                        message: "Please select at least one course" 
                                    }
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select courses you can tutor"
                                    style={{ width: '100%' }}
                                    suffixIcon={<BookOutlined />}
                                >
                                    {courseOptions.map(course => (
                                        <Option key={course} value={course}>
                                            {course}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Optional Password */}
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    { 
                                        min: 6, 
                                        message: "Password must be at least 6 characters long" 
                                    }
                                ]}
                            >
                                <Input.Password 
                                    placeholder="Optional password" 
                                />
                            </Form.Item>

                            {/* Submit Button */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 mt-4"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Registering..." : "Register as Tutor"}
                                </Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default CombinedRegister;