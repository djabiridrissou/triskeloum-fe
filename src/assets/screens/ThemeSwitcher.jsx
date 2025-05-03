import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from './ThemeContext';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="theme-switcher">
      <Switch
        checked={darkMode}
        onChange={toggleDarkMode}
        checkedChildren={<BulbOutlined />}
        unCheckedChildren={<BulbFilled />}
        className={`theme-switch ${darkMode ? 'dark' : 'light'}`}
      />
    </div>
  );
};

export default ThemeSwitcher;