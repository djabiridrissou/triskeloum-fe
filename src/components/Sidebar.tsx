// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import {
  DashboardOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  DownOutlined,
  RightOutlined,
  BarsOutlined,
  FireOutlined,
  TeamOutlined,
  MessageOutlined,
  BellOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: MenuItem[];
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathToKey: Record<string, string> = {
      '/admin': '1',
      '/admin/users': '2',
      '/admin/crm': '3',
      '/admin/courses/exercises': '4',
      '/admin/courses/reels': '5',
      '/admin/courses/quotes': '6',
      '/admin/courses/faqs': '7',
      '/admin/courses': '8',
      '/admin/courses/categories': '8-1',
      '/admin/levels': '9',
      '/admin/courses/list': '8-3',
    };

    const currentKey = pathToKey[location.pathname] || '1';
    setSelectedKey(currentKey);

    if (currentKey.startsWith('8-')) {
      setOpenKeys(prev => [...new Set([...prev, '8'])]);
    }
  }, [location.pathname]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    // ✅ Fermer tous les menus quand on collapse
    if (!collapsed) {
      setOpenKeys([]);
    }
  };

  const getMenuItems = (): MenuItem[] => {
    return [
      {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        path: '/admin',
      },
      {
        key: '2',
        icon: <TeamOutlined />,
        label: 'Utilisateurs',
        path: '/admin/users',
      },
      {
        key: '9',
        icon: <BarsOutlined />,
        label: 'Niveaux',
        path: '/admin/levels',
      },
      {
        key: '8',
        icon: <BookOutlined />,
        label: 'Cours',
        children: [
          {
            key: '8-1',
            icon: <AppstoreOutlined />,
            label: 'Catégories',
            path: '/admin/courses/categories',
          },
         
          {
            key: '8-3',
            icon: <UnorderedListOutlined />,
            label: 'Liste',
            path: '/admin/courses/list',
          },
        ],
      },
      {
        key: '4',
        icon: <FireOutlined />,
        label: 'Exercices',
        path: '/admin/courses/exercises',
      },
      {
        key: '3',
        icon: <MessageOutlined />,
        label: 'Chat',
        path: '/admin/crm',
      },
      {
        key: '5',
        icon: <VideoCameraOutlined />,
        label: 'Reels',
        path: '/admin/courses/reels',
      },
      {
        key: '6',
        icon: <FileTextOutlined />,
        label: 'Citations',
        path: '/admin/courses/quotes',
      },
      {
        key: '7',
        icon: <QuestionCircleOutlined />,
        label: 'FAQs',
        path: '/admin/courses/faqs',
      },
     
    ];
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (item: MenuItem) => {
    setSelectedKey(item.key);
    
    // ✅ Si c'est un parent avec children, toggle l'ouverture
    if (item.children) {
      setOpenKeys(prev => 
        prev.includes(item.key) 
          ? prev.filter(k => k !== item.key)
          : [...prev, item.key]
      );
    }
    
    // ✅ Si c'est un lien, naviguer
    if (item.path) {
      navigate(item.path);
    }
  };

  const isOpen = (key: string) => openKeys.includes(key);

  const getItemStyle = (itemKey: string, isChild = false) => {
    const isSelected = selectedKey === itemKey;
    const isHovered = hoveredKey === itemKey;
    
    return {
      display: 'flex',
      alignItems: 'center',
      padding: collapsed ? '16px 0' : isChild ? '12px 24px 12px 52px' : '16px 24px',
      margin: collapsed ? '8px 12px' : isChild ? '4px 16px 4px 16px' : '8px 16px',
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
      fontSize: isChild ? '13px' : '14px',
      transform: isHovered && !isSelected ? 'translateX(4px)' : 'translateX(0)',
      boxShadow: isSelected 
        ? '0 8px 25px rgba(0, 0, 0, 0.2)' 
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

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemOpen = isOpen(item.key);

    return (
      <div key={item.key}>
        {/* Menu item */}
        <div
          style={getItemStyle(item.key, isChild)}
          onClick={() => handleMenuClick(item)}
          onMouseEnter={() => setHoveredKey(item.key)}
          onMouseLeave={() => setHoveredKey(null)}
        >
          <div style={getIconStyle(item.key)}>
            {item.icon}
          </div>
          
          {!collapsed && (
            <>
              <span
                style={{
                  fontSize: isChild ? '13px' : '14px',
                  fontWeight: selectedKey === item.key ? '600' : '500',
                  transition: 'all 0.3s ease',
                  flex: 1,
                }}
              >
                {item.label}
              </span>

              {/* ✅ Flèche pour les items avec children */}
              {hasChildren && (
                <div
                  style={{
                    marginLeft: '8px',
                    transition: 'transform 0.3s ease',
                    transform: isItemOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                    color: selectedKey === item.key ? '#ffffff' : '#94a3b8',
                  }}
                >
                  <DownOutlined style={{ fontSize: '10px' }} />
                </div>
              )}

              {/* Active indicator pour items sans children */}
              {selectedKey === item.key && !hasChildren && (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    opacity: 0.8,
                    marginLeft: '8px',
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* ✅ Sous-menu (children) */}
        {hasChildren && !collapsed && (
          <div
            style={{
              maxHeight: isItemOpen ? '500px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
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
          background: 'linear-gradient(180deg, #000000 0%, #333333 100%)',
        }}
      />

      {/* Header avec logo/titre */}
      {!collapsed && (
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
            }}
          >
            Admin Panel
          </h2>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: '#94a3b8',
            }}
          >
            Gestion de la plateforme
          </p>
        </div>
      )}

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

      {/* Menu items */}
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

        {menuItems.map(item => renderMenuItem(item))}
      </div>

      {/* Footer avec bouton collapse */}
      {!collapsed && (
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <Button
            type="text"
            icon={<MenuUnfoldOutlined />}
            onClick={toggleCollapsed}
            style={{
              width: '100%',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Réduire
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;