// PDF 用的費用走勢圖：去除互動、字體放大、顏色用 rgb()
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const COLORS = {
  current: 'rgb(148, 163, 184)',
  optimal: 'rgb(34, 197, 94)',
  bar: 'rgba(59, 130, 246, 0.55)',
  barBorder: 'rgb(59, 130, 246)',
  axis: 'rgb(71, 85, 105)',
  grid: 'rgb(226, 232, 240)',
};

export function PdfFeeChart({ chartData, currentCapacity, optimalCapacity }) {
  if (!chartData || !chartData.capacities || chartData.capacities.length === 0) {
    return null;
  }

  const data = {
    labels: chartData.capacities.map((c) => `${c}`),
    datasets: [
      {
        label: '年度基本電費',
        data: chartData.fees,
        backgroundColor: chartData.capacities.map((c) =>
          c === optimalCapacity
            ? COLORS.optimal
            : c === currentCapacity
              ? COLORS.current
              : COLORS.bar
        ),
        borderColor: chartData.capacities.map((c) =>
          c === optimalCapacity
            ? COLORS.optimal
            : c === currentCapacity
              ? COLORS.current
              : COLORS.barBorder
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      title: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '契約容量 (kW)',
          color: COLORS.axis,
          font: { size: 11 },
        },
        ticks: {
          color: COLORS.axis,
          font: { size: 9 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 12,
        },
        grid: { color: COLORS.grid },
      },
      y: {
        title: {
          display: true,
          text: '年度電費 (元)',
          color: COLORS.axis,
          font: { size: 11 },
        },
        ticks: {
          color: COLORS.axis,
          font: { size: 9 },
          callback: (value) => `${(value / 1000).toFixed(0)}K`,
        },
        grid: { color: COLORS.grid },
      },
    },
  };

  return (
    <div style={{ width: '660px', height: '260px' }}>
      <Bar data={data} options={options} width={660} height={260} />
    </div>
  );
}

export default PdfFeeChart;
