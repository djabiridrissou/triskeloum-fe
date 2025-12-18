import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useLoadUserQuery } from "../services/api";
import Loading from "../components/Loading";

const { Content } = Layout;

const AdminLayout = () => {
    const { data: user, isLoading, error } = useLoadUserQuery({});
    const navigate = useNavigate();
    
    // États pour la responsivité
    const [isMobile, setIsMobile] = useState(false);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    // Détection du mode mobile
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            
            // Si on passe en mode desktop, fermer le drawer mobile
            if (!mobile) {
                setMobileDrawerOpen(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        navigate("/login");
        return null;
    }

    const toggleMobileDrawer = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar fixe en haut */}
            <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                <Navbar />
            </div>
            
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Sidebar pour Desktop - Version simplifiée */}
                {!isMobile && (
                    <div style={{ width: '200px', flexShrink: 0 }}>
                        <Sidebar />
                    </div>
                )}

                {/* Drawer pour Mobile */}
                {isMobile && (
                    <Drawer
                        title="Menu"
                        placement="left"
                        onClose={toggleMobileDrawer}
                        open={mobileDrawerOpen}
                        bodyStyle={{ padding: 0 }}
                        width={280}
                    >
                        <Sidebar />
                    </Drawer>
                )}

                {/* Zone de contenu principal */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Header mobile avec bouton menu */}
                    {isMobile && (
                        <div
                            className="dark:bg-bg-secondary bg-white dark:text-text-primary dark:shadow-amber-900/10"
                            style={{
                                padding: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                zIndex: 1,
                                flexShrink: 0,
                            }}
                        >
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={toggleMobileDrawer}
                                className="dark:text-amber-400 dark:hover:bg-amber-900/20"
                                style={{
                                    fontSize: '16px',
                                    width: 40,
                                    height: 40,
                                }}
                            />
                            <h3 className="dark:text-text-primary" style={{ margin: 0, marginLeft: '16px' }}>Dashboard</h3>
                        </div>
                    )}

                    {/* Contenu principal avec Outlet - Zone scrollable */}
                    <div
                        className="dark:bg-bg-primary bg-gray-50"
                        style={{
                            flex: 1,
                            padding: isMobile ? '16px' : '0px',
                            overflow: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;