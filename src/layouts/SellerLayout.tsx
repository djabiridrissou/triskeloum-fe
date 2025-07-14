

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useLoadUserQuery } from "../services/api";
import Loading from "../components/Loading";

const { Content } = Layout;

const SupplierLayout = () => {
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
                    <div style={{ width: '256px', flexShrink: 0 }}>
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
                            style={{
                                padding: '16px',
                                background: '#fff',
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
                                style={{
                                    fontSize: '16px',
                                    width: 40,
                                    height: 40,
                                }}
                            />
                            <h3 style={{ margin: 0, marginLeft: '16px' }}>Dashboard</h3>
                        </div>
                    )}

                    {/* Contenu principal avec Outlet - Zone scrollable */}
                    <div
                        style={{
                            flex: 1,
                            padding: isMobile ? '16px' : '24px',
                            background: '#f5f5f5',
                            overflow: 'auto',
                        }}
                    >
                        <div
                            style={{
                                background: '#fff',
                                padding: '24px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                minHeight: 'calc(100vh - 200px)',
                            }}
                        >
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierLayout;