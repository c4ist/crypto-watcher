import { Line } from 'react-chartjs-2';
import { ChartOptions, TooltipItem } from 'chart.js';
import { PredictionData } from '../types/crypto';
import { format } from 'date-fns';

interface Props {
  predictions: PredictionData[];
  currentPrice: number;
}

export const PredictionChart = ({ predictions, currentPrice }: Props) => {
  const allPrices = [currentPrice, ...predictions.map(p => p.predicted_price)];
  const minPrice = Math.min(...allPrices) * 0.95;
  const maxPrice = Math.max(...allPrices) * 1.05;

  const data = {
    labels: ['Now', ...predictions.map(p => format(new Date(p.timestamp), 'MMM d'))],
    datasets: [
      {
        label: 'Price Prediction',
        data: [currentPrice, ...predictions.map(p => p.predicted_price)],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Confidence Range',
        data: predictions.map(p => p.predicted_price * (1 + (1 - p.confidence))),
        borderColor: 'rgba(37, 99, 235, 0.3)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: 'Confidence Range',
        data: predictions.map(p => p.predicted_price * (1 - (1 - p.confidence))),
        borderColor: 'rgba(37, 99, 235, 0.3)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            const value = Number(tooltipItem.raw);
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        min: minPrice,
        max: maxPrice,
        ticks: {
          callback: (tickValue: number | string) => {
            const value = Number(tickValue);
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="card w-full flex flex-col items-center">
      <h3 className="text-xl font-bold mb-6 text-center">Price Prediction</h3>
      <div className="w-full max-w-2xl">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
