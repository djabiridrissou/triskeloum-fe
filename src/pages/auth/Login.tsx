import { useState, useEffect } from "react";
import { Button, Input, Card, Form, Checkbox, Divider, Spin } from "antd";
import { MailOutlined, LockOutlined, TeamOutlined } from "@ant-design/icons";
import { useLoginMutation, useLoadUserQuery } from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [login, { isLoading }] = useLoginMutation();
    const { data: userResponse, isLoading: isCheckingAuth } = useLoadUserQuery({});
    const navigate = useNavigate();

    // Fonction pour déterminer la route selon le rôle
    const getDashboardRoute = (role: string) => {
        switch (role) {
            case 'SYSTEM_ADMIN':
                return '/admin/home';
            case 'EMPLOYEE':
                return '/employee/home';
            case 'RECEPTIONIST':
                return '/receptionist/dashboard';
            default:
                return '/fsm';
        }
    };

    useEffect(() => {
        if (!isCheckingAuth && userResponse?.user) {
            const userRole = userResponse.user.role.name;
            const redirectRoute = getDashboardRoute(userRole);
            navigate(redirectRoute, { replace: true });
        }
    }, [userResponse, isCheckingAuth, navigate]);

    useEffect(() => {
        if (!userResponse?.user) {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
        }
    }, [userResponse]);

    const handleLogin = async (values: { email: string; password: string; companyId?: string }) => {
        const credentials = {
            email: values.email,
            password: values.password,
            ...(values.companyId && { companyId: values.companyId })
        };

        try {
            const result: any = await login(credentials);

            if ('error' in result) {
                console.log('Login error:', result.error);
                const error: any = result.error as any;
                const status = error?.status || error?.data?.statusCode;
                const message = error?.data?.message || 'Erreur de connexion';

                switch (status) {
                    case 404:
                        Swal.fire({
                            icon: 'error',
                            title: 'User not found',
                            text: error.data.message || 'Invalid email or password.',
                        });
                        break;

                    case 401:
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.data.message || 'Invalid email or password.',
                        });
                        break;

                    case 403:
                        Swal.fire({
                            icon: 'warning',
                            title: 'Account pending',
                            text: error.data.message || 'Invalid email or password.',
                        });
                        break;

                    default:
                        Swal.fire({
                            icon: 'error',
                            title: 'Connection error',
                            text: error.data.message || 'Invalid email or password.',
                        });
                        break;
                }
                return;
            }

            const response = result.data;

            if (response.success) {
                const userData = response.data.user;
                const userRole = response?.data?.user?.role;
                localStorage.setItem('userEmail', userData.email);
                localStorage.setItem('userId', userData.id);
                localStorage.setItem('userRole', userRole);
                localStorage.setItem('companyId', userData.companyId || '');
                Swal.fire({
                    icon: 'success',
                    title: 'Connexion réussie',
                    text: 'Bienvenue sur VMS !',
                    timer: 2000,
                    showConfirmButton: false,
                });
                const redirectRoute = getDashboardRoute(userRole);
                console.log('Redirecting to:', redirectRoute);
                setTimeout(() => {
                    navigate(redirectRoute, { replace: true });
                }, 1000);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur serveur',
                text: 'Une erreur interne s\'est produite. Veuillez réessayer.',
            });
        }
    };

    // Affichage du loader pendant la vérification d'auth
    if (isCheckingAuth) {
        return (
            <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Spin size="large" />
                    <div className="mt-4 text-gray-600">Please wait...</div>
                </div>
            </div>
        );
    }

    // Ne pas afficher le formulaire si déjà connecté
    if (userResponse?.user) {
        return null;
    }

    return (
        <div className="w-full flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                {/* Logo et titre */}
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <img src="/images/vms.png" alt="" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Visitor Management System
                    </h1>
                    <p className="text-gray-600">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Formulaire de connexion */}
                <Card className="shadow-xl border-0 rounded-2xl overflow-hidden backdrop-blur-sm bg-white/95">
                    <div className="p-8">
                        <Form
                            name="vms_login_form"
                            initialValues={{ remember: true }}
                            onFinish={handleLogin}
                            layout="vertical"
                            size="large"
                        >
                            <div className="space-y-6">
                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Email</span>}
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Enter your email'
                                        },
                                        {
                                            type: 'email',
                                            message: 'Invalid email format'
                                        }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="your@email.com"
                                        className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 h-12"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-gray-700 font-medium">Password</span>}
                                    name="password"
                                    rules={[{
                                        required: true,
                                        message: 'Enter your password'
                                    }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-gray-400" />}
                                        placeholder="Your Password"
                                        className="rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 h-12"
                                    />
                                </Form.Item>

                                <div className="flex justify-between items-center">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox className="text-gray-600">
                                            Remember Me
                                        </Checkbox>
                                    </Form.Item>
                                    <a
                                        href="#"
                                        className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // TODO: Implémenter mot de passe oublié
                                            Swal.fire({
                                                icon: 'info',
                                                title: 'Password Forgotten ?',
                                                text: 'Contact your system administrator.',
                                            });
                                        }}
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                <Form.Item>
                                    <button
                                        className="w-full h-12 bg-black cursor-pointer from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 rounded-lg text-lg font-semibold shadow-lg transition-all duration-300 text-white"
                                    >
                                        {isLoading ? 'Connexion...' : 'Log In'}
                                    </button>
                                </Form.Item>
                            </div>
                        </Form>
                        <Divider className="my-6">
                            <span className="text-gray-400 text-sm">New to Visitor Management System?</span>
                        </Divider>
                        <div className="text-center space-y-3">
                            <Button
                                type="default"
                                onClick={() => navigate('/register')}
                                className="w-full h-11 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 bg-bla"
                            >
                                Register
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Informations sur les rôles */}
                {/*  <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Types de comptes :</h3>
                    <div className="space-y-1 text-xs text-gray-600">
                        <div><strong>Administrateur :</strong> Gestion complète du système</div>
                        <div><strong>Employé :</strong> Gestion de vos visites et rendez-vous</div>
                        <div><strong>Réceptionniste :</strong> Accueil et gestion des visiteurs</div>
                    </div>
                </div> */}

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    <p>
                        RevGen - Visitor Management System © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;