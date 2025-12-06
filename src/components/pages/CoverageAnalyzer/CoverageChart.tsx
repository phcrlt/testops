import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styles from './CoverageChart.module.css';

interface CoverageData {
  module: string;
  percentage: number;
  total: number;
  covered: number;
  priority: 'high' | 'medium' | 'low';
}

interface CoverageChartProps {
  data: CoverageData[];
}

const CoverageChart: React.FC<CoverageChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.module.length > 15 ? item.module.substring(0, 15) + '...' : item.module,
    'Покрытие (%)': item.percentage,
    'Всего тестов': item.total,
    'Покрыто тестов': item.covered,
    fullName: item.module,
    priority: item.priority,
  }));

  const getColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ea4335'; // red
      case 'medium': return '#fbbc04'; // yellow
      case 'low': return '#34a853'; // green
      default: return '#4285f4'; // blue
    }
  };

  const CustomTooltip = ({ active, payload, label: _label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipTitle}>{data.fullName}</p>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipLabel}>Покрытие:</span>
              <span className={styles.tooltipValue}>{data['Покрытие (%)']}%</span>
            </div>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipLabel}>Покрыто тестов:</span>
              <span className={styles.tooltipValue}>{data['Покрыто тестов']}</span>
            </div>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipLabel}>Всего тестов:</span>
              <span className={styles.tooltipValue}>{data['Всего тестов']}</span>
            </div>
            <div className={styles.tooltipItem}>
              <span className={styles.tooltipLabel}>Приоритет:</span>
              <span className={styles.tooltipValue}>
                {data.priority === 'high' ? 'Высокий' : 
                 data.priority === 'medium' ? 'Средний' : 'Низкий'}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            label={{ 
              value: 'Покрытие (%)', 
              angle: -90, 
              position: 'insideLeft',
              fill: 'var(--text-secondary)'
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span style={{ color: 'var(--text-secondary)' }}>{value}</span>
            )}
          />
          <Bar 
            dataKey="Покрытие (%)" 
            name="Покрытие (%)"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry.priority)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#ea4335' }} />
          <span className={styles.legendText}>Высокий приоритет (&lt;80%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#fbbc04' }} />
          <span className={styles.legendText}>Средний приоритет (80-90%)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#34a853' }} />
          <span className={styles.legendText}>Низкий приоритет (&gt;90%)</span>
        </div>
      </div>
    </div>
  );
};

export default CoverageChart;