/**
 * Contribution Radar Chart Component
 * Ant Design Charts radar chart
 */

import { Radar } from '@ant-design/charts';

export default function ContributionRadar({ personal, total }) {
  // Calculate percentages safely
  const signalCountPercent = total.signalCount > 0 
    ? (personal.signalCount / total.signalCount) * 100 
    : 0;
  const accuracyPercent = personal.accuracy || 0;
  const contributionPercent = personal.contributionPercentage || 0;
  const revenueSharePercent = total.totalRevenue > 0 
    ? (personal.revenue / total.totalRevenue) * 100 
    : 0;

  const data = [
    {
      item: 'Signal Count',
      personal: Math.min(signalCountPercent, 100),
      total: 100,
    },
    {
      item: 'Accuracy',
      personal: Math.min(accuracyPercent, 100),
      total: 100,
    },
    {
      item: 'Contribution %',
      personal: Math.min(contributionPercent, 100),
      total: 100,
    },
    {
      item: 'Revenue Share',
      personal: Math.min(revenueSharePercent, 100),
      total: 100,
    },
  ];

  const config = {
    data: data.map(d => ({
      ...d,
      personal: Math.round(d.personal),
      total: Math.round(d.total),
    })),
    xField: 'item',
    yField: 'personal',
    area: {},
    point: {
      size: 2,
    },
    meta: {
      personal: {
        alias: 'Your Contribution',
        min: 0,
        max: 100,
      },
    },
    color: ['#667eea'],
  };

  return (
    <div style={{ height: '400px' }}>
      <Radar {...config} />
    </div>
  );
}

