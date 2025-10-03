import React from 'react';
import { Form, Input, Select, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ReceptionistFormProps {
    form: any;
    companies: any[];
    loading?: boolean;
    onFinish: (values: any) => void; // Ajout du callback
}

export const ReceptionistRegistrationForm: React.FC<ReceptionistFormProps> = ({
    form,
    companies,
    loading,
    onFinish // Utiliser le callback directement
}) => {
    return (
        <Form
            form={form}
            layout="vertical"
            size="small"
            onFinish={onFinish} // Connecter directement ici
        >
            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            { required: true, message: 'First name is required' },
                            { min: 2, message: 'Minimum 2 characters' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Your first name"
                            className="h-9"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            { required: true, message: 'Last name is required' },
                            { min: 2, message: 'Minimum 2 characters' }
                        ]}
                    >
                        <Input
                            placeholder="Your last name"
                            className="h-9"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Email Address"
                name="email"
                rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Invalid email format' }
                ]}
            >
                <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="your.email@company.com"
                    className="h-9"
                />
            </Form.Item>

            <Row gutter={12}>
                <Col span={12}>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Password is required' },
                            { min: 8, message: 'Minimum 8 characters' }
                        ]}
                    >
                        <Input.Password
                            placeholder="Create password"
                            className="h-9"
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            autoComplete='new-password'
                            placeholder="Confirm password"
                            className="h-9"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Company"
                name="companyId"
                rules={[{ required: true, message: 'Please select your company' }]}
            >
                <Select
                    placeholder="Select your company"
                    loading={loading}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.children as unknown as string)
                            ?.toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    className="h-9"
                >
                    {companies.map((company) => (
                        <Option key={company._id} value={company._id}>
                            <div className="flex items-center space-x-2">
                                <BankOutlined className="text-gray-400" />
                                <span>{company.name}</span>
                            </div>
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                label="Phone"
                name="phone"
                rules={[
                    {
                        pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
                        message: 'Invalid phone number'
                    }
                ]}
            >
                <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="+233 XX XXX XXXX"
                    className="h-9"
                />
            </Form.Item>
        </Form>
    );
};