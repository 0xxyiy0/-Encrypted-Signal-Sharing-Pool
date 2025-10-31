/**
 * Encryption Progress Component
 * Shows encryption animation while encrypting signal
 */

import { Card, Progress, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export default function EncryptionProgress() {
  return (
    <Card
      style={{
        marginBottom: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div style={{ textAlign: 'center' }}>
          <LockOutlined style={{ fontSize: '32px', marginBottom: '8px' }} spin />
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Encrypting Signal...
          </div>
        </div>
        <Progress
          percent={100}
          showInfo={false}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          status="active"
        />
        <div style={{ fontSize: '12px', textAlign: 'center', opacity: 0.9 }}>
          Your signal is being encrypted with FHE. This may take a few seconds.
        </div>
      </Space>
    </Card>
  );
}

