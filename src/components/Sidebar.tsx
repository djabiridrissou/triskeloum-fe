import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('userRole') || 'buyer';
  
  useEffect(() => {
    const pathToKey: any = {
      '/admin/home': '1',
      '/dashboard': '1',
      '/admin/buyers': '2',
      '/admin/sellers': '3',
      '/admin/homologation': '4',
      '/admin/orders': '5',
      '/supplier/catalogue': '6',
      '/seller/sales': '7',
      '/buyer/home': '8',
      '/buyer/sales': '9'
    };

    const currentKey = pathToKey[location.pathname] || '1';
    setSelectedKey(currentKey);
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getMenuItems = () => {
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
        {
          key: '5',
          icon: <DashboardOutlined />,
          label: 'Commandes',
          path: '/admin/orders',
        },
      ];
    } else if (cleanUserRole === 'supplier') {
      return [
        {
          key: '6',
          icon: <ShopOutlined />,
          label: 'Mon Stock',
          path: '/supplier/catalogue',
        },
        {
          key: '7',
          icon: <FcSalesPerformance />,
          label: 'Mes Ventes',
          path: '/seller/sales',
        },
      ];
    } else { // buyer
      return [
        {
          key: '8',
          icon: <DashboardOutlined />,
          label: 'Catalogue',
          path: '/buyer/home',
        },
        {
          key: '9',
          icon: <UserOutlined />,
          label: 'Mes Commandes',
          path: '/buyer/sales',
        },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (item: any) => {
    setSelectedKey(item.key);
    if (item.path) {
      navigate(item.path);
    }
  };

  const getItemStyle = (itemKey: string) => {
    const isSelected = selectedKey === itemKey;
    const isHovered = hoveredKey === itemKey;
    
    return {
      display: 'flex',
      alignItems: 'center',
      padding: collapsed ? '16px 0' : '16px 24px',
      margin: collapsed ? '8px 12px' : '8px 16px',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative' as const,
      background: isSelected 
        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
        : isHovered 
        ? '#f8fafc' 
        : 'transparent',
      color: isSelected ? '#ffffff' : '#64748b',
      fontWeight: isSelected ? '600' : '500',
      fontSize: '14px',
      transform: isHovered && !isSelected ? 'translateX(4px)' : 'translateX(0)',
      boxShadow: isSelected 
        ? '0 8px 25px rgba(16, 185, 129, 0.3)' 
        : isHovered 
        ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
        : 'none',
      justifyContent: collapsed ? 'center' : 'flex-start',
    };
  };

  const getIconStyle = (itemKey: string) => {
    const isSelected = selectedKey === itemKey;
    return {
      fontSize: '18px',
      marginRight: collapsed ? '0' : '12px',
      color: isSelected ? '#ffffff' : '#94a3b8',
      transition: 'all 0.3s ease',
    };
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        width: collapsed ? '80px' : '280px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
        }}
      />

      {/* Header */}
{/*       <div
        style={{
          height: '80px',
          padding: collapsed ? '20px 16px' : '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid #e2e8f0',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 'bold',
              marginRight: collapsed ? '0' : '12px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            }}
          >
            {collapsed ? 'A' : 'A'}
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1e293b',
                  lineHeight: '1.2',
                }}
              >
                Admin Panel
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: '500',
                }}
              >
                Gestion & Contrôle
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <Button
            type="text"
            icon={<MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          />
        )}
      </div> */}

      {/* Expand button for collapsed state */}
      {collapsed && (
        <div
          style={{
            padding: '16px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          flex: 1,
          padding: '24px 0',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            marginBottom: '16px',
            padding: collapsed ? '0' : '0 24px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: collapsed ? 'none' : 'block',
          }}
        >
          Navigation
        </div>

        {menuItems.map((item) => (
          <div
            key={item.key}
            style={getItemStyle(item.key)}
            onClick={() => handleMenuClick(item)}
            onMouseEnter={() => setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
          >
            <div style={getIconStyle(item.key)}>
              {item.icon}
            </div>
            {!collapsed && (
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: selectedKey === item.key ? '600' : '500',
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </span>
            )}
            
            {/* Active indicator */}
            {selectedKey === item.key && (
              <div
                style={{
                  position: 'absolute',
                  right: '8px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  opacity: 0.8,
                  display: collapsed ? 'none' : 'block',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: collapsed ? '16px 12px' : '24px',
          borderTop: '1px solid #e2e8f0',
          background: 'rgba(248, 250, 252, 0.8)',
        }}
      >
        <div
          style={{
            padding: collapsed ? '12px 0' : '16px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            textAlign: 'center',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              fontSize: collapsed ? '10px' : '12px',
              color: '#64748b',
              fontWeight: '500',
            }}
          >
            {collapsed ? 'v2.1' : 'Version 2.1.0'}
          </div>
          {!collapsed && (
            <div
              style={{
                fontSize: '10px',
                color: '#94a3b8',
                marginTop: '2px',
              }}
            >
              Dernière mise à jour
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;