/**
 * Main App Component
 * Encrypted Signal Sharing Pool - Dashboard
 */

import { useState } from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import { WalletProvider } from './contexts/WalletContext';
import MainLayout from './components/Layout/MainLayout';
import SignalInput from './components/SignalInput/SignalInput';
import AggregationDashboard from './components/Dashboard/AggregationDashboard';
import ContributionTracking from './components/Contribution/ContributionTracking';
import RevenueDistribution from './components/Revenue/RevenueDistribution';
import Settings from './components/Settings/Settings';
import './App.css';

// Ant Design theme customization
const theme = {
  token: {
    colorPrimary: '#722ed1', // Purple for encryption theme
  },
};

function App() {
  const [currentView, setCurrentView] = useState('aggregation-dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'signal-input':
        return <SignalInput />;
      case 'aggregation-dashboard':
        return <AggregationDashboard />;
      case 'contribution-tracking':
        return <ContributionTracking />;
      case 'revenue-distribution':
        return <RevenueDistribution />;
      case 'settings':
        return <Settings />;
      default:
        return <AggregationDashboard />;
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <WalletProvider>
          <MainLayout
            currentView={currentView}
            onViewChange={setCurrentView}
          >
            {renderContent()}
          </MainLayout>
        </WalletProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
