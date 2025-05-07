import React from 'react';
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useVerifyStudentMutation, useVerifyTutorMutation } from "../../services/api";
import Swal from "sweetalert2";

const Verify: React.FC = () => {
    const [verifyStudent, { isLoading: isStudentVerifying }] = useVerifyStudentMutation();
    const [verifyTutor, { isLoading: isTutorVerifying }] = useVerifyTutorMutation();

    const [form] = Form.useForm();

    const handleVerify = async (values: { phoneNumber: string, otp: string }) => {
        try {
            const userType = localStorage.getItem("userType");
            const phoneNumber = localStorage.getItem("userPhone");

            values.phoneNumber = phoneNumber || "";

            const response = userType === "student"
                ? await verifyStudent(values).unwrap()
                : await verifyTutor(values).unwrap();

            console.log("Verification Success:", response);

            // Clear user type from local storage after verification
            localStorage.removeItem("userType");

            // Store user details if needed
            if (response.data) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            Swal.fire({
                title: "Verification Successful!",
                text: "You have successfully verified your account.",
                icon: "success",
                confirmButtonText: "Continue",
            }).then(() => {
                if (userType === "student") {
                    window.location.href = "/login";
                } else {
                    window.location.href = "/login";
                }
            })

        } catch (error) {
            console.error("Verification failed:", error);
            Swal.fire({
                title: "Verification Error!",
                text: (error as any).data?.error || "Verification failed. Please try again.",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <div className="mb-4 flex justify-center">
                    <img src="/images/logob.png" alt="Jodi Construction" className="h-42" />
                </div>

                <h2 className="mb-6 text-center text-lg font-semibold text-gray-700">
                    Verify Your Account
                </h2>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleVerify}
                    className="mt-4"
                >
                    {/* <Form.Item 
                        name="phoneNumber" 
                        label="Phone Number" 
                        rules={[
                            { required: true, message: "Please enter your phone number" },
                            { 
                                pattern: /^[0-9]{10}$/, 
                                message: "Phone number must be 10 digits" 
                            }
                        ]}
                    >
                        <Input 
                            prefix={<PhoneOutlined className="text-gray-400" />} 
                            placeholder="Enter your phone number" 
                        />
                    </Form.Item>
 */}
                    <Form.Item
                        name="otp"
                        label="OTP"
                        rules={[
                            { required: true, message: "Please enter the OTP" },
                            {
                                len: 6,
                                message: "OTP must be 6 characters long"
                            }
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-yellow-500 hover:bg-indigo-600"
                            loading={
                                localStorage.getItem("userType") === "student"
                                    ? isStudentVerifying
                                    : isTutorVerifying
                            }
                        >
                            Verify
                        </Button>
                    </Form.Item>
                </Form>

                <div className="flex justify-center text-sm mt-4">
                    <a href="/login" className="text-indigo-500 hover:underline">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Verify;