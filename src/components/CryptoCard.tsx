import { CryptoAsset, PredictionData } from '../types/crypto';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface Props {
  crypto: CryptoAsset;
  onClick: () => void;
  isExpanded: boolean;
  predictions?: PredictionData[];
  isLoadingPredictions: boolean;
}

export const CryptoCard = ({ crypto, onClick, isExpanded, predictions, isLoadingPredictions }: Props) => {
  const chartData = {
    labels: Array(crypto.sparkline_in_7d.price.length).fill(''),
    datasets: [
      {
        fill: true,
        data: crypto.sparkline_in_7d.price,
        borderColor: crypto.price_change_percentage_24h >= 0 ? '#22c55e' : '#ef4444',
        backgroundColor: crypto.price_change_percentage_24h >= 0 
          ? 'rgba(34, 197, 94, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <motion.div 
      layout
      onClick={onClick}
      className={`group p-6 rounded-2xl bg-[#151C2F] hover:bg-[#1B2236] transition-all duration-300 cursor-pointer border border-white/5 hover:border-primary/20 relative overflow-hidden ${
        isExpanded ? 'col-span-2 row-span-2' : ''
      }`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-colors duration-300"></div>
            <img src={crypto.image} alt={crypto.name} className="w-10 h-10 relative" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{crypto.name}</h3>
            <p className="text-[#94A3B8] text-sm">{crypto.symbol.toUpperCase()}</p>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                ${crypto.current_price.toLocaleString()}
              </p>
              <p className="text-sm text-[#94A3B8]">Current Price</p>
            </div>
            <span 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                crypto.price_change_percentage_24h >= 0 
                  ? 'text-[#10b981] bg-[#10b981]/10 group-hover:bg-[#10b981]/20' 
                  : 'text-[#ef4444] bg-[#ef4444]/10 group-hover:bg-[#ef4444]/20'
              } transition-colors duration-300`}
            >
              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
          
          <div className="h-[80px] -mx-2 -mb-4">
            <Line data={chartData} options={options} />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <h4 className="text-lg font-semibold text-white mb-4">Price Prediction</h4>
                {isLoadingPredictions ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : predictions ? (
                  <div className="h-[200px]">
                    <Line
                      data={{
                        labels: ['Now', ...predictions.map(p => new Date(p.timestamp).toLocaleDateString())],
                        datasets: [{
                          label: 'Predicted Price',
                          data: [crypto.current_price, ...predictions.map(p => p.predicted_price)],
                          borderColor: '#2563eb',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          fill: true,
                          tension: 0.4,
                        }],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                return `$${Number(context.raw).toLocaleString()}`;
                              },
                            },
                          },
                        },
                        scales: {
                          x: {
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)',
                            },
                            ticks: {
                              color: '#94A3B8',
                            },
                          },
                          y: {
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)',
                            },
                            ticks: {
                              color: '#94A3B8',
                              callback: (value) => `$${Number(value).toLocaleString()}`,
                            },
                          },
                        },
                      }}
                    />
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
