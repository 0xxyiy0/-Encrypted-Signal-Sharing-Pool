/**
 * Decryption Status Component
 * Shows Gateway polling progress and decryption status
 */

import { Card, Progress, Space, Tag } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useDecryption } from '../../hooks/useDecryption';

// Use actual decryption hook

export default function DecryptionStatus() {
  const { status, progress, error, result } = useDecryption();
  
  const message = status === 'polling' 
    ? 'Gateway is decrypting aggregation result...'
    : status === 'completed'
    ? 'Decryption completed successfully!'
    : status === 'failed'
    ? `Decryption failed: ${error}`
    : 'No active decryption requests';

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'polling':
        return <SyncOutlined spin style={{ color: '#1890ff' }} />;
      case 'failed':
        return <CheckCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#999' }} />;
    }
  };

  const getStatusTag = () => {
    switch (status) {
      case 'completed':
        return <Tag color="success">Completed</Tag>;
      case 'polling':
        return <Tag color="processing">Polling Gateway...</Tag>;
      case 'failed':
        return <Tag color="error">Failed</Tag>;
      default:
        return <Tag>Idle</Tag>;
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          {getStatusIcon()}
          <span>{message}</span>
        </Space>
        {getStatusTag()}
      </div>
      
      {status === 'polling' && (
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
        />
      )}
      
      {status === 'idle' && (
        <div style={{ color: '#999', fontSize: '12px' }}>
          Gateway will decrypt aggregation results automatically when requested.
        </div>
      )}
    </Space>
  );
}

