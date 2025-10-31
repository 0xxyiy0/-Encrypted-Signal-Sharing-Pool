/**
 * Main Layout Component
 * Dashboard-centric layout with sidebar and main panel
 */

import { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const { Content } = Layout;

export default function MainLayout({ children, currentView, onViewChange }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleMenuClick = ({ key }) => {
    onViewChange(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        selectedKey={currentView}
        onMenuClick={handleMenuClick}
        collapsed={collapsed}
      />
      <Layout style={{ marginLeft: collapsed ? 80 : 280 }}>
        <TopBar />
        <Content style={{
          margin: '24px',
          padding: '24px',
          background: '#fff',
          minHeight: 'calc(100vh - 112px)',
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

