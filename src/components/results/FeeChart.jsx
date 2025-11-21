// 費用分布圖表元件

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card } from '../ui/Card';

// 註冊 Chart.js 元件
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function FeeChart({ chartData, currentCapacity, optimalCapacity }) {
  if (!chartData || chartData.capacities.length === 0) {
    return null;
  }

  const { capacities, fees, optimalIndex, currentIndex } = chartData;

  // 設定長條圖顏色
  const backgroundColors = capacities.map((c, i) => {
    if (i === optimalIndex) return 'rgba(34, 197, 94, 0.8)'; // 最佳 - 綠色
    if (i === currentIndex) return 'rgba(59, 130, 246, 0.8)'; // 目前 - 藍色
    return 'rgba(156, 163, 175, 0.5)'; // 其他 - 灰色
  });

  const borderColors = capacities.map((c, i) => {
    if (i === optimalIndex) return 'rgb(34, 197, 94)';
    if (i === currentIndex) return 'rgb(59, 130, 246)';
    return 'rgb(156, 163, 175)';
  });

  const data = {
    labels: capacities.map((c) => `${c}`),
    datasets: [
      {
        label: '年度基本電費',
        data: fees,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '不同契約容量的年度費用比較',
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => `契約容量：${context[0].label} kW`,
          label: (context) => {
            const fee = context.parsed.y;
            let label = `年度費用：${Math.round(fee).toLocaleString()} 元`;

            const capacity = capacities[context.dataIndex];
            if (capacity === optimalCapacity) {
              label += ' (最佳)';
            } else if (capacity === currentCapacity) {
              label += ' (目前)';
            }

            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '契約容量 (kW)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: '年度費用 (元)',
        },
        ticks: {
          callback: (value) => `${(value / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  return (
    <Card title="費用分布圖" className="mb-6">
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>

      {/* 圖例說明 */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-blue-500"></span>
          <span>目前契約容量</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-green-500"></span>
          <span>建議契約容量</span>
        </div>
      </div>
    </Card>
  );
}

export default FeeChart;
