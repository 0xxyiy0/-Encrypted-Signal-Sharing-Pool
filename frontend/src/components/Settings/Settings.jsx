/**
 * Settings Component
 * Network and feature settings
 */

import { useState, useEffect } from 'react';
import { Card, Switch, Space, Typography, Divider, Tag, Button, message, Descriptions, App } from 'antd';
import { CopyOutlined as CopyIcon, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useWallet } from '../../contexts/WalletContext';
import { useFHEMode, isFHEAvailable } from '../../hooks/useFHEMode';
import { 
  CONTRACT_ADDRESS_MOCK, 
  CONTRACT_ADDRESS_FHE,
  SEPOLIA_CHAIN_ID,
  SEPOLIA_RPC_URL,
  ZAMA_GATEWAY_URL,
  getCurrentContractAddress,
  FHEVM_ENABLED_DEFAULT
} from '../../config/contracts';

const { Text, Paragraph } = Typography;

export default function Settings() {
  const { account, isConnected, chainId } = useWallet();
  const { fheModeEnabled, isFHEAvailable, setFHEMode, toggleFHEMode } = useFHEMode();
  const { modal, message } = App.useApp(); // Use App.useApp() for Modal and Message with context support
  const [copiedAddress, setCopiedAddress] = useState(null);

  const formatAddress = (address) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'Not configured';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`Copied ${label} to clipboard`);
      setCopiedAddress(label);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      message.error('Failed to copy to clipboard');
    }
  };

  const getNetworkName = () => {
    if (chainId === 11155111) return 'Sepolia Testnet';
    if (chainId === 1) return 'Ethereum Mainnet';
    return `Unknown (Chain ID: ${chainId || 'N/A'})`;
  };

  const isNetworkCorrect = () => {
    return chainId === SEPOLIA_CHAIN_ID;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Wallet Connection */}
      <Card title="Wallet Connection">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text strong>Connection Status:</Text>
            {isConnected ? (
              <Tag color="success" style={{ marginLeft: '8px' }}>
                <CheckCircleOutlined /> Connected
              </Tag>
            ) : (
              <Tag color="default" style={{ marginLeft: '8px' }}>
                Not Connected
              </Tag>
            )}
          </div>
          {isConnected && account && (
            <>
              <div>
                <Text strong>Address:</Text>
                <Text code style={{ marginLeft: '8px', fontFamily: 'monospace' }}>
                  {formatAddress(account)}
                </Text>
                <Button
                  type="text"
                  size="small"
                  icon={<CopyIcon />}
                  onClick={() => copyToClipboard(account, 'address')}
                  style={{ marginLeft: '8px' }}
                />
              </div>
              <div>
                <Text strong>Network:</Text>
                <Tag color={isNetworkCorrect() ? 'success' : 'warning'} style={{ marginLeft: '8px' }}>
                  {getNetworkName()}
                </Tag>
                {!isNetworkCorrect() && (
                  <Text type="warning" style={{ marginLeft: '8px', fontSize: '12px' }}>
                    Please switch to Sepolia Testnet
                  </Text>
                )}
              </div>
            </>
          )}
        </Space>
      </Card>

      {/* Network Settings */}
      <Card title="Network Settings">
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="Network">
            Sepolia Testnet
          </Descriptions.Item>
          <Descriptions.Item label="Chain ID">
            {SEPOLIA_CHAIN_ID}
          </Descriptions.Item>
          <Descriptions.Item label="RPC URL">
            <Space>
              <Text code style={{ fontSize: '11px' }}>{SEPOLIA_RPC_URL}</Text>
              <Button
                type="text"
                size="small"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(SEPOLIA_RPC_URL, 'RPC URL')}
              />
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Gateway URL">
            <Space>
              <Text code style={{ fontSize: '11px' }}>{ZAMA_GATEWAY_URL}</Text>
              <Button
                type="text"
                size="small"
                icon={<CopyIcon />}
                onClick={() => copyToClipboard(ZAMA_GATEWAY_URL, 'Gateway URL')}
              />
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Contract Configuration */}
      <Card title="Contract Configuration">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text strong>Current Mode:</Text>
            <Tag color={fheModeEnabled ? 'purple' : 'blue'} style={{ marginLeft: '8px' }}>
              {fheModeEnabled ? 'FHE (Encrypted)' : 'Mock (Plaintext)'}
            </Tag>
          </div>
          <Divider style={{ margin: '12px 0' }} />
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Mock Contract:</Text>
            <Space>
              <Text code style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {formatAddress(CONTRACT_ADDRESS_MOCK)}
              </Text>
              {CONTRACT_ADDRESS_MOCK !== '0x0000000000000000000000000000000000000000' && (
                <>
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyIcon />}
                    onClick={() => copyToClipboard(CONTRACT_ADDRESS_MOCK, 'Mock Contract')}
                  />
                      {!fheModeEnabled && (
                        <Tag color="blue" size="small">Active</Tag>
                      )}
                </>
              )}
            </Space>
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>FHE Contract:</Text>
            <Space>
              <Text code style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {formatAddress(CONTRACT_ADDRESS_FHE)}
              </Text>
              {CONTRACT_ADDRESS_FHE !== '0x0000000000000000000000000000000000000000' && (
                <>
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyIcon />}
                    onClick={() => copyToClipboard(CONTRACT_ADDRESS_FHE, 'FHE Contract')}
                  />
                      {fheModeEnabled && (
                        <Tag color="purple" size="small">Active</Tag>
                      )}
                </>
              )}
            </Space>
          </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Current Contract:</Text>
                <Space>
                  <Text code style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {formatAddress(getCurrentContractAddress())}
                  </Text>
                  {getCurrentContractAddress() !== '0x0000000000000000000000000000000000000000' && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyIcon />}
                      onClick={() => copyToClipboard(getCurrentContractAddress(), 'Current Contract')}
                    />
                  )}
                  {fheModeEnabled ? (
                    <Tag color="purple" size="small">FHE Active</Tag>
                  ) : (
                    <Tag color="blue" size="small">Mock Active</Tag>
                  )}
                </Space>
              </div>
          <Divider style={{ margin: '12px 0' }} />
          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
              You can switch between Mock and FHE modes using the switch in "Feature Settings" below.
            </Text>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Contract addresses can be updated in <Text code>frontend/.env.local</Text>
            </Text>
          </div>
        </Space>
      </Card>

      {/* Feature Settings */}
      <Card title="Feature Settings">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text strong>FHE Encryption Mode</Text>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {fheModeEnabled 
                    ? 'Using fully homomorphic encrypted contract' 
                    : 'Using plaintext mock contract for testing'}
                </Text>
                {!isFHEAvailable && (
                  <div style={{ marginTop: '4px' }}>
                    <Text type="warning" style={{ fontSize: '11px' }}>
                      ⚠️ FHE contract not deployed. Switch disabled.
                    </Text>
                  </div>
                )}
              </div>
            </div>
            <Switch 
              checked={fheModeEnabled} 
              disabled={!isFHEAvailable}
              onChange={(checked) => {
                if (!isFHEAvailable && checked) {
                  message.warning('FHE contract not deployed. Please deploy FHE contract first.');
                  return;
                }
                
                // Use Modal from App.useApp() for context support
                modal.confirm({
                  title: `Switch to ${checked ? 'FHE' : 'Mock'} Mode?`,
                  content: (
                    <div>
                      <p>You are about to switch to <strong>{checked ? 'FHE (Encrypted)' : 'Mock (Plaintext)'}</strong> mode.</p>
                      <p style={{ marginTop: '8px', color: '#666', fontSize: '12px', whiteSpace: 'pre-line' }}>
                        {checked 
                          ? '• Signals will be encrypted before submission\n• Gateway will decrypt aggregation results\n• Full privacy-preserving computation enabled'
                          : '• Signals will be stored in plaintext\n• Faster computation, no encryption overhead\n• Suitable for testing and development'}
                      </p>
                      <p style={{ marginTop: '12px', fontWeight: 'bold', color: '#fa8c16' }}>
                        ⚠️ You need to refresh the page for the change to take effect.
                      </p>
                    </div>
                  ),
                  okText: 'Switch & Refresh',
                  cancelText: 'Cancel',
                  onOk: () => {
                    const success = setFHEMode(checked);
                    if (success) {
                      message.success({
                        content: `Switched to ${checked ? 'FHE' : 'Mock'} mode. Refreshing page...`,
                        duration: 2,
                      });
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }
                  },
                });
              }}
              title={isFHEAvailable 
                ? "Click to switch between FHE and Mock modes" 
                : "FHE mode unavailable - contract not deployed"}
            />
          </div>
          <Divider />
          <div>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
              FHE mode enables privacy-preserving computations. Signals are encrypted before submission and remain private during aggregation.
            </Text>
            {isFHEAvailable ? (
              <div style={{ marginTop: '8px', padding: '8px', background: '#f6ffed', borderRadius: '4px', border: '1px solid #b7eb8f' }}>
                <Text style={{ fontSize: '12px', color: '#389e0d' }}>
                  ✅ <strong>FHE Mode Available</strong>
                </Text>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#389e0d' }}>
                  Both Mock and FHE contracts are deployed. You can switch modes at any time using the switch above.
                  <div style={{ marginTop: '4px' }}>
                    <Text type="secondary" style={{ fontSize: '10px' }}>
                      Note: After switching, refresh the page to apply the changes.
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '8px', padding: '8px', background: '#fff7e6', borderRadius: '4px', border: '1px solid #ffe58f' }}>
                <Text style={{ fontSize: '12px', color: '#ad6800' }}>
                  ⚠️ <strong>FHE Mode Unavailable</strong>
                </Text>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#ad6800' }}>
                  FHE contract is not deployed yet. To enable FHE mode:
                  <ol style={{ margin: '4px 0 0 20px', padding: 0 }}>
                    <li>Deploy FHE contract using: <Text code>npm run deploy:fhe</Text></li>
                    <li>Update <Text code>frontend/.env.local</Text> with FHE contract address</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </Space>
      </Card>

      {/* About */}
      <Card title="About">
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <div>
            <Text strong>Project:</Text>
            <Text style={{ marginLeft: '8px' }}>Encrypted Signal Sharing Pool</Text>
          </div>
          <div>
            <Text strong>Description:</Text>
            <Text type="secondary" style={{ marginLeft: '8px' }}>
              Privacy-preserving trading signal aggregation using FHEVM
            </Text>
          </div>
          <div>
            <Text strong>Technology Stack:</Text>
            <Text style={{ marginLeft: '8px' }}>FHEVM, React, Ant Design, Echarts, ethers.js</Text>
          </div>
          <div>
            <Text strong>Network:</Text>
            <Text style={{ marginLeft: '8px' }}>Ethereum Sepolia Testnet</Text>
          </div>
          <div>
            <Text strong>Gateway:</Text>
            <Text style={{ marginLeft: '8px' }}>Zama Gateway (Sepolia)</Text>
          </div>
        </Space>
      </Card>

      {/* Environment Info */}
      <Card title="Environment Information">
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Configuration is loaded from environment variables. Check <Text code>frontend/.env.local</Text> for current settings.
          </Text>
          <div style={{ marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
            <Text code style={{ fontSize: '11px' }}>
              VITE_FHEVM_ENABLED={FHEVM_ENABLED_DEFAULT ? 'true' : 'false'} (default from .env)<br />
              Runtime Mode: {fheModeEnabled ? 'FHE (from localStorage)' : 'Mock (from localStorage)'}<br />
              VITE_CONTRACT_MOCK={CONTRACT_ADDRESS_MOCK}<br />
              VITE_CONTRACT_FHE={CONTRACT_ADDRESS_FHE}
            </Text>
          </div>
        </Space>
      </Card>
    </Space>
  );
}

