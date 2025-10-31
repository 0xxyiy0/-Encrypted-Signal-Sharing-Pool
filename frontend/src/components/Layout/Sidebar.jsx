/**
 * Sidebar Component
 * Left sidebar navigation (20% width on desktop)
 */

import { Layout, Menu } from 'antd';
import {
  SignalFilled,
  DashboardOutlined,
  TrophyOutlined,
  DollarOutlined,
  SettingOutlined,
  LockOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const menuItems = [
  {
    key: 'signal-input',
    icon: <LockOutlined />,
    label: 'Signal Input',
  },
  {
    key: 'aggregation-dashboard',
    icon: <DashboardOutlined />,
    label: 'Aggregation Dashboard',
  },
  {
    key: 'contribution-tracking',
    icon: <TrophyOutlined />,
    label: 'Contribution Tracking',
  },
  {
    key: 'revenue-distribution',
    icon: <DollarOutlined />,
    label: 'Revenue Distribution',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
  },
];

export default function Sidebar({ selectedKey, onMenuClick, collapsed }) {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={280}
      style={{
        minHeight: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ 
        padding: '16px', 
        color: 'white', 
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: collapsed ? 'center' : 'left',
      }}>
        {collapsed ? '🔒' : '🔒 Signal Pool'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={onMenuClick}
      />
    </Sider>
  );
}

