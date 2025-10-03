import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('userRole') || 'buyer';
  
  useEffect(() => {
    const pathToKey: any = {
      '/': '1',
      '/projects': '2'
    };

    const currentKey = pathToKey[location.pathname] || '1';
    setSelectedKey(currentKey);
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getMenuItems = () => {
    return [
      {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        path: '/',
      },
      {
        key: '2',
        icon: <DashboardOutlined />,
        label: 'Projects',
        path: '/projects',
      }
    ];
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
        ? 'black' 
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
                  right: '12px',
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
    </div>
  );
};

export default Sidebar;