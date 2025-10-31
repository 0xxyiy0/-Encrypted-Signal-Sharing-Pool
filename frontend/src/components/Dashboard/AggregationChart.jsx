/**
 * Aggregation Chart Component
 * Echarts line chart showing aggregation results over time
 */

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function AggregationChart({ aggregations = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Prepare data
    console.log('📊 Preparing chart data from aggregations:', aggregations);
    
    const times = aggregations.map((agg, index) => `T${index + 1}`);
    
    // Support both 'type' and 'aggType' fields
    const meanData = aggregations
      .filter(agg => (agg.type === 0 || agg.aggType === 0))
      .map(agg => agg.result);
    const weightedData = aggregations
      .filter(agg => (agg.type === 1 || agg.aggType === 1))
      .map(agg => agg.result);
    
    console.log('📊 Chart data prepared:', {
      times,
      meanData,
      weightedData,
      aggregationCount: aggregations.length,
    });

    // Chart configuration
    const option = {
      title: {
        text: 'Aggregated Signal Values',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Mean', 'Weighted Mean'],
        top: '10%',
      },
      xAxis: {
        type: 'category',
        data: times.length > 0 ? times : ['No Data'],
        name: 'Time',
      },
      yAxis: {
        type: 'value',
        name: 'Signal Value',
      },
      series: [
        {
          name: 'Mean',
          type: 'line',
          data: meanData.length > 0 ? meanData : [0],
          smooth: true,
          itemStyle: { color: '#667eea' },
        },
        {
          name: 'Weighted Mean',
          type: 'line',
          data: weightedData.length > 0 ? weightedData : [0],
          smooth: true,
          itemStyle: { color: '#764ba2' },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [aggregations]);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '400px',
        minHeight: '400px',
      }}
    />
  );
}

