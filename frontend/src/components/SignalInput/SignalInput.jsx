/**
 * Signal Input Component
 * Form for contributing encrypted signals
 */

import { useState } from 'react';
import { Card, Form, InputNumber, Select, Button, App } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useWallet } from '../../contexts/WalletContext';
import { useSignalPool, SIGNAL_TYPE } from '../../hooks/useSignalPool';
import EncryptionProgress from './EncryptionProgress';

const { Option } = Select;

const SIGNAL_TYPES = [
  { value: 0, label: 'Price Prediction' },
  { value: 1, label: 'Volatility Estimate' },
  { value: 2, label: 'Buy/Sell Vote' },
];

export default function SignalInput() {
  const { isConnected } = useWallet();
  const { message } = App.useApp(); // Use App.useApp() for message with context support
  const { contributeSignal, loading, error } = useSignalPool();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    if (!isConnected) {
      message.error('Please connect your wallet first');
      return;
    }

    try {
      const hideLoading = message.loading('Submitting signal...', 0);
      
      const { txHash, signalId } = await contributeSignal(
        values.signalType,
        values.value,
        values.weight
      );

      hideLoading();
      
      if (signalId !== null && signalId !== undefined) {
        message.success(`Signal #${signalId} contributed successfully! TX: ${txHash.slice(0, 10)}...`);
      } else {
        message.success(`Signal contributed successfully! Transaction: ${txHash.slice(0, 10)}...`);
      }
      
      form.resetFields();
    } catch (err) {
      console.error('Error contributing signal:', err);
      message.error(`Failed to contribute signal: ${err.message}`);
    }
  };

  return (
    <div>
      <Card title="Contribute Encrypted Signal" style={{ marginBottom: '24px' }}>
        {loading && <EncryptionProgress />}
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={!isConnected || loading}
        >
          <Form.Item
            name="signalType"
            label="Signal Type"
            rules={[{ required: true, message: 'Please select signal type' }]}
          >
            <Select placeholder="Select signal type">
              {Object.entries(SIGNAL_TYPE).map(([key, value]) => {
                const label = SIGNAL_TYPES.find(t => t.value === value)?.label || key;
                return (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Signal Value"
            rules={[{ required: true, message: 'Please enter signal value' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Enter signal value"
              min={0}
              max={1000000}
            />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Weight (for weighted aggregation)"
            rules={[{ required: true, message: 'Please enter weight' }]}
            initialValue={1}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Weight"
              min={1}
              max={100}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<LockOutlined />}
              loading={loading}
              block
              size="large"
            >
              {loading ? 'Encrypting & Submitting...' : 'Contribute Encrypted Signal'}
            </Button>
          </Form.Item>
        </Form>

        {!isConnected && (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '16px' }}>
            Please connect your wallet to contribute signals
          </div>
        )}
      </Card>

      <Card title="📝 How It Works">
        <ol style={{ lineHeight: '2' }}>
          <li>Enter your trading signal value</li>
          <li>Signal is encrypted using FHE before leaving your device 🔒</li>
          <li>Encrypted signal is stored on-chain</li>
          <li>Your signal remains private - never revealed!</li>
          <li>Participate in encrypted aggregation for revenue sharing</li>
        </ol>
      </Card>
    </div>
  );
}

