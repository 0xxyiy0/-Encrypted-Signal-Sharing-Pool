/**
 * Top Bar Component
 * Wallet connection, notifications, settings
 */

import { Button, Badge, Dropdown, Space } from 'antd';
import {
  WalletOutlined,
  BellOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import { useWallet } from '../../contexts/WalletContext';

export default function TopBar() {
  const { account, connectWallet, disconnectWallet, isConnecting, chainId, switchToSepolia } = useWallet();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isSepolia = chainId === 11155111;

  const walletMenuItems = account ? [
    {
      key: 'account',
      label: (
        <div>
          <div style={{ fontWeight: 'bold' }}>Connected</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{formatAddress(account)}</div>
        </div>
      ),
    },
    {
      key: 'network',
      label: (
        <div>
          <div>Network</div>
          <div style={{ fontSize: '12px', color: isSepolia ? '#52c41a' : '#ff4d4f' }}>
            {isSepolia ? '✓ Sepolia' : `✗ Chain ID: ${chainId}`}
          </div>
        </div>
      ),
    },
    {
      key: 'switch',
      label: !isSepolia ? 'Switch to Sepolia' : null,
      onClick: !isSepolia ? switchToSepolia : null,
    },
    {
      type: 'divider',
    },
    {
      key: 'disconnect',
      label: (
        <Space>
          <DisconnectOutlined />
          Disconnect
        </Space>
      ),
      onClick: disconnectWallet,
      danger: true,
    },
  ].filter(item => item.label !== null) : [];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <Space size="large">
        {/* Wallet Connection */}
        {account ? (
          <Dropdown menu={{ items: walletMenuItems }} placement="bottomRight">
            <Button type="primary" icon={<CheckCircleOutlined />}>
              {formatAddress(account)}
            </Button>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            icon={<WalletOutlined />}
            loading={isConnecting}
            onClick={connectWallet}
          >
            Connect Wallet
          </Button>
        )}

        {/* Network Indicator */}
        {account && !isSepolia && (
          <Button type="default" danger onClick={switchToSepolia}>
            Switch to Sepolia
          </Button>
        )}

        {/* Notifications */}
        <Badge count={0} showZero={false}>
          <Button
            type="text"
            icon={<BellOutlined />}
            style={{ fontSize: '18px' }}
          />
        </Badge>

        {/* Settings */}
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{ fontSize: '18px' }}
        />
      </Space>
    </div>
  );
}

