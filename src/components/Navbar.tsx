import React, { useState, useEffect } from 'react';
import {
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    TeamOutlined,
    BankOutlined,
    CalendarOutlined,
    SettingOutlined,
    BellOutlined,
    MenuOutlined,
    CloseOutlined,
    DownOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Dropdown,
    Button,
    Badge,
    Drawer,
    Space,
    Typography,
    notification
} from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLoadUserQuery, useLogoutMutation } from '../services/api';

const { Text, Title } = Typography;

interface User {
    id: string;
    email: string;
    role: {
        name: string;
    };
    isActive: boolean;
    lastLogin?: string;
}

const Navbar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    const { data: response, isLoading, error, refetch } = useLoadUserQuery({});
    const [logout] = useLogoutMutation({});

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .vms-navbar {
                background: white;
                border-bottom: 1px solid #f0f0f0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                backdrop-filter: blur(10px);
            }

            .navbar-container {
                
                margin: 0 auto;
                padding: 0 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 64px;
            }

            .navbar-logo {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: opacity 0.2s ease;
            }

            .navbar-logo:hover {
                opacity: 0.8;
            }

            .logo-icon {
                width: 90px;
                height: 90px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
            }

            .navbar-actions {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .notification-btn {
                position: relative;
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #64748b;
            }

            .notification-btn:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
                color: #475569;
            }

            .user-profile {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 16px;
                border-radius: 12px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 160px;
            }

            .user-profile:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
            }

            .user-info {
                flex: 1;
                min-width: 0;
            }

            .user-email {
                font-size: 14px;
                font-weight: 500;
                color: #1e293b;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .user-role {
                font-size: 12px;
                color: #64748b;
                margin: 0;
            }

            .mobile-menu-btn {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #64748b;
            }

            .mobile-menu-btn:hover {
                background: #f1f5f9;
                border-color: #cbd5e1;
                color: #475569;
            }

            .dropdown-menu .ant-dropdown-menu {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid #e2e8f0;
                padding: 8px;
                min-width: 200px;
            }

            .dropdown-menu .ant-dropdown-menu-item {
                border-radius: 8px;
                margin: 2px 0;
                padding: 12px 16px;
                transition: all 0.2s ease;
            }

            .dropdown-menu .ant-dropdown-menu-item:hover {
                background: #f8fafc;
            }

            .dropdown-menu .ant-dropdown-menu-item-danger:hover {
                background: #fef2f2;
                color: #dc2626;
            }

            @media (max-width: 768px) {
                .navbar-container {
                    padding: 0 16px;
                }
                
                .user-info {
                    display: none;
                }
                
                .user-profile {
                    min-width: auto;
                    padding: 8px;
                }
                
                .notification-btn {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

    useEffect(() => {
        
    }, [response]);

    const handleLogout = async () => {
        try {
        
            await logout().unwrap();
            
            // Nettoyer le localStorage
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            
            setUser(null);
            
            notification.success({
                message: 'Déconnexion réussie',
                description: 'À bientôt sur VMS !',
                placement: 'topRight',
            });
            
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getRoleDisplayName = (roleName: string) => {
        switch (roleName) {
            case 'SYSTEM_ADMIN':
                return 'System Admin';
            case 'EMPLOYEE':
                return 'Employee';
            case 'RECEPTIONIST':
                return 'Receptionist';
            default:
                return 'User';
        }
    };

    const getNavigationItems = () => {
        if (!user) return [];

        const items = [
            {
                key: 'dashboard',
                label: (
                    <Space>
                        <DashboardOutlined />
                        <span>Dashboard</span>
                    </Space>
                ),
                onClick: () => navigate('/'),
            }
        ];

        if (user.role.name === 'SYSTEM_ADMIN') {
            items.push(
                
            );
        }

        if (user.role.name === 'EMPLOYEE' || user.role.name === 'RECEPTIONIST') {
            items.push(
                {
                    key: 'visits',
                    label: (
                        <Space>
                            <CalendarOutlined />
                            <span>Visits</span>
                        </Space>
                    ),
                    onClick: () => navigate('/visits'),
                }
            );
        }

        return items;
    };

    const getUserMenuItems = (): MenuProps['items'] => {
        if (!user) return [];

        return [
            ...getNavigationItems(),
            { type: 'divider' },
            {
                key: 'logout',
                label: (
                    <Space>
                        <LogoutOutlined />
                        <span>Déconnexion</span>
                    </Space>
                ),
                onClick: handleLogout,
                danger: true,
            },
        ];
    };

    if (isLoading) {
        return (
            <nav className="vms-navbar">
                <div className="navbar-container">
                    <div className="navbar-logo">
                        <div className="logo-icon">
                            <TeamOutlined />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                                VMS
                            </Title>
                        </div>
                    </div>
                    <div>Chargement...</div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="vms-navbar">
            <div className="navbar-container !pl-[90px]">
                {/* Logo */}
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <div className="logo-icon">
                      <span className="text-black"></span>
                    </div>
                    <div className="hidden sm:block">
                        <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                          
                        </Title>
                        <Text style={{ fontSize: '12px', color: '#64748b' }}>
                           
                        </Text>
                    </div>
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    {user && (
                        <>
                            {/* Notifications */}
                            <Badge count={0} size="small">
                                <div className="notification-btn">
                                    <BellOutlined />
                                </div>
                            </Badge>

                            {/* Profil utilisateur */}
                            <Dropdown
                                menu={{ items: getUserMenuItems() }}
                                placement="bottomRight"
                                trigger={['click']}
                                className="dropdown-menu"
                            >
                                <div className="user-profile">
                                    <Avatar 
                                        size={32} 
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#3b82f6' }}
                                    />
                                    <div className="user-info">
                                        <div className="user-email">{user.email}</div>
                                        <div className="user-role">
                                            {getRoleDisplayName(user.role.name)}
                                        </div>
                                    </div>
                                    <DownOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                                </div>
                            </Dropdown>
                        </>
                    )}

                    {/* {!user && (
                        <Button 
                            type="primary" 
                            onClick={() => navigate('/login')}
                            style={{ borderRadius: '8px' }}
                        >
                            Connexion
                        </Button>
                    )}
 */}
                    {/* Menu mobile */}
                    <div className="md:hidden">
                        <div
                            className="mobile-menu-btn"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drawer mobile */}
            <Drawer
                title="Menu Navigation"
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                width={280}
            >
                <div className="space-y-2">
                    {user && getNavigationItems().map((item) => (
                        <Button
                            key={item.key}
                            block
                            type="text"
                            size="large"
                            onClick={() => {
                                item.onClick();
                                setMobileMenuOpen(false);
                            }}
                            style={{ 
                                justifyContent: 'flex-start',
                                height: '48px',
                                borderRadius: '8px'
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                    
                    {user && (
                        <>
                            <div style={{ height: '16px' }} />
                            <Button
                                block
                                danger
                                type="text"
                                size="large"
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                style={{ 
                                    justifyContent: 'flex-start',
                                    height: '48px',
                                    borderRadius: '8px'
                                }}
                            >
                                <Space>
                                    <LogoutOutlined />
                                    <span>Déconnexion</span>
                                </Space>
                            </Button>
                        </>
                    )}
                </div>
            </Drawer>
        </nav>
    );
};

export default Navbar;