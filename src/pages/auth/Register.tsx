import React, { useState } from 'react';
import {
    Card,
    Tabs,
    Button,
    Form,
    Typography,
    Space,
    Alert
} from 'antd';
import {
    TeamOutlined,
    UserAddOutlined,
    PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ReceptionistRegistrationForm } from './sections/ReceptionistRegistration';
import { EmployeeRegistrationForm } from './sections/EmployeeRegistration';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('employee');
    const [employeeForm] = Form.useForm();
    const [receptionistForm] = Form.useForm();

   
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
         
        </div>
    );
};

export default Register;