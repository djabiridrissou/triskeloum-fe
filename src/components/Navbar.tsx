import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    UserOutlined, 
    LogoutOutlined, 
    SettingOutlined 
} from '@ant-design/icons';
import { Dropdown, Avatar, Menu } from 'antd';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Retrieve user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user data', error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menu = (
        <Menu>
            <Menu.Divider />
            <Menu.Item key="dashboard" icon={<SettingOutlined />} onClick={() => {
                if (user.role === 'student') {
                    navigate('/students/dashboard');
                } else if (user.role === 'tutor') {
                    navigate('/tutors/dashboard');
                }
            }}>
                Dashboard
            </Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <nav className="bg-white shadow-md py-2">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div onClick={() => navigate('/')} className="cursor-pointerbg-white text-xs font-bold text-blue-600 w-[50px]">
                   <img src="images/logob.png" alt="" /> <span className='text-white text-xs flex'></span>
                </div>
                
                {user ? (
                    <Dropdown 
                        overlay={menu} 
                        placement="bottomRight" 
                        trigger={['click']}
                    >
                        <div 
                            ref={userMenuRef} 
                            className="cursor-pointer flex items-center"
                        >
                            <Avatar 
                                size="large" 
                                icon={<UserOutlined />} 
                                src={user.picture} 
                                className="mr-2"
                            />
                            <span className="ml-2 text-gray-800 font-medium">
                                {user.name || 'User'}
                            </span>
                        </div>
                    </Dropdown>
                ) : (
                    <div className="flex items-center">
                        <button 
                            className="bg-white hover:bg-white hover:text-black border border-black cursor-pointer  text-black py-2 px-4 rounded"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;