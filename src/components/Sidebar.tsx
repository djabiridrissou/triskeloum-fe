import React, { useState, useEffect } from 'react';
import { Menu, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcSalesPerformance } from "react-icons/fc";
import { IoPricetag } from "react-icons/io5";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('userRole') || 'buyer';
  useEffect(() => {
    const pathToKey: any = {
      '/admin/home': '1',
      '/dashboard': '1',
      '/admin/buyers': '2',
      '/admin/fournisseurs': '3'
    };

    const currentKey = pathToKey[location.pathname] || '1';
    setSelectedKey(currentKey);
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        path: '/admin/home',
      },
    ];

    const cleanUserRole = userRole?.trim().replace(/"/g, '').toLowerCase();

    if (cleanUserRole === 'admin') {
      return [
        {
          key: '1',
          icon: <DashboardOutlined />,
          label: 'Dashboard',
          path: '/admin/home',
        },
        {
          key: '2',
          icon: <UserOutlined />,
          label: 'Vendeurs',
          path: '/admin/buyers',
        },
        {
          key: '3',
          icon: <ShopOutlined />,
          label: 'Fournisseurs',
          path: '/admin/sellers',
        },
        {
          key: '4',
          icon: <IoPricetag />,
          label: 'Homologation',
          path: '/admin/homologation',
        },
      ];
    } else if (cleanUserRole === 'supplier') {
      return [
        {
          key: '4',
          icon: <ShopOutlined />,
          label: 'Mon Stock',
          path: '/supplier/catalogue',
        },
        {
          key: '5',
          icon: <FcSalesPerformance color='black' />,
          label: 'Mes Ventes',
          path: '/seller/sales',
        },
      ];
    } else { // buyer
      return [
        {
          key: '8',
          icon: <UserOutlined />,
          label: 'Catalogue',
          path: '/buyer/home',
        },
        {
          key: '7',
          icon: <UserOutlined />,
          label: 'Mes Commandes',
          path: '/buyer/orders',
        },
      ];
    }
  };
  const menuItems = getMenuItems();
  console.log('Menu Items:', menuItems); // Pour débogage, à retirer en production

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);

    // Trouver l'élément de menu correspondant et naviguer vers son path
    const menuItem = menuItems.find(item => item.key === e.key);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        background: '#001529',
        boxShadow: '2px 0 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        width: collapsed ? '80px' : '256px',
        transition: 'width 0.2s',
      }}
    >
      {/* Header de la sidebar */}
      <div
        style={{
          height: '64px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1f1f1f',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '18px',
            fontWeight: 'bold',
            marginLeft: collapsed ? '0' : '8px',
          }}
        >
          {collapsed ? 'A' : 'Admin'}
        </div>

        {/* Bouton collapse intégré à la sidebar */}
       {/*  <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          style={{
            color: '#fff',
            fontSize: '16px',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        /> */}
      </div>

      {/* Menu scrollable */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          style={{
            borderRight: 0,
            height: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;