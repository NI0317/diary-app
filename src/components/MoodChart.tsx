import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MoodChartProps {
  data: Array<{
    date: string;
    mood: number;
  }>;
}

export default function MoodChart({ data }: MoodChartProps) {
  const chartRef = useRef<any>(null);
  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    console.log('图表渲染性能:', {
      renderTime: endTime - startTime.current,
      dataPoints: data.length,
      timestamp: new Date().toISOString()
    });
  }, [data]);

  const chartData: ChartData<'line'> = {
    labels: data.map((entry) => format(new Date(entry.date), 'MM/dd', { locale: zhCN })),
    datasets: [
      {
        label: '心情指数',
        data: data.map((entry) => entry.mood),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '心情趋势',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
} 