/**
 * Contribution Bar Chart Component
 * Personal vs total contribution comparison
 */

import { Column } from '@ant-design/charts';

export default function ContributionBar({ personal, total }) {
  // Scale revenue for better visualization (multiply by 1000 to show in smaller units)
  const data = [
    {
      type: 'Your Signals',
      value: personal.signalCount || 0,
      category: 'personal',
    },
    {
      type: 'Total Signals',
      value: total.signalCount || 0,
      category: 'total',
    },
    {
      type: 'Your Revenue',
      value: (personal.revenue || 0) * 1000, // Scale for display (ETH * 1000)
      category: 'personal',
    },
    {
      type: 'Total Revenue',
      value: (total.totalRevenue || 0) * 1000, // Scale for display
      category: 'total',
    },
  ];

  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: 'category',
    color: ['#667eea', '#d9d9d9'],
    legend: {
      position: 'top',
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Column {...config} />
    </div>
  );
}

