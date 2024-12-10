import { CryptoAsset, PredictionData, MarketTrend } from '../types/crypto';
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

interface CryptoCardProps {
  crypto: CryptoAsset;
  onClick: () => void;
  isExpanded: boolean;
  predictions?: PredictionData[];
  isLoadingPredictions?: boolean;
  marketTrend?: MarketTrend;
  isLoadingMarketTrend?: boolean;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
  crypto,
  onClick,
  isExpanded,
  predictions,
  isLoadingPredictions,
  marketTrend,
  isLoadingMarketTrend,
}) => {
  const chartData = {
    labels: Array(crypto.sparkline_in_7d.price.length).fill(''),
    datasets: [
      {
        fill: true,
        data: crypto.sparkline_in_7d.price,
        borderColor: crypto.price_change_percentage_24h >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        backgroundColor: crypto.price_change_percentage_24h >= 0 
          ? 'rgba(34, 197, 94, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
  };

  return (
    <motion.div 
      layout
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer transition-colors hover:bg-white/10 ${
        isExpanded ? 'col-span-2' : ''
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
            <Line data={chartData} options={chartOptions} />
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                animate={{ height: 'auto' }}
                initial={false}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Price Prediction</h3>
                    {isLoadingPredictions ? (
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : predictions && predictions.length > 0 ? (
                      <div className="h-[200px]">
                        <Line
                          data={{
                            labels: ['Now', ...predictions.map(p => new Date(p.timestamp).toLocaleDateString())],
                            datasets: [
                              {
                                label: 'Predicted Price',
                                data: [crypto.current_price, ...predictions.map(p => p.predicted_price)],
                                borderColor: 'rgb(59, 130, 246)',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                fill: true,
                                tension: 0.4,
                                pointRadius: 4,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const value = context.raw as number;
                                    return `$${value.toLocaleString()}`;
                                  },
                                },
                              },
                            },
                            scales: {
                              x: {
                                grid: {
                                  display: false,
                                },
                              },
                              y: {
                                beginAtZero: false,
                                grid: {
                                  color: 'rgba(255, 255, 255, 0.1)',
                                },
                                ticks: {
                                  callback: (value) => `$${Number(value).toLocaleString()}`,
                                  color: 'rgba(255, 255, 255, 0.5)',
                                },
                              },
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500">No prediction data available</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Market Trend</h3>
                    {isLoadingMarketTrend ? (
                      <div className="h-[100px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : marketTrend ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">RSI</p>
                          <p className={`text-lg font-semibold ${
                            marketTrend.rsi > 70 ? 'text-red-500' :
                            marketTrend.rsi < 30 ? 'text-green-500' :
                            'text-gray-900'
                          }`}>
                            {marketTrend.rsi.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">MACD</p>
                          <p className={`text-lg font-semibold ${
                            marketTrend.macd > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {marketTrend.macd.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Volume Change</p>
                          <p className={`text-lg font-semibold ${
                            marketTrend.volumeChange > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {marketTrend.volumeChange.toFixed(2)}%
                          </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">Trend</p>
                          <p className={`text-lg font-semibold ${
                            marketTrend.trend === 'bullish' ? 'text-green-500' :
                            marketTrend.trend === 'bearish' ? 'text-red-500' :
                            'text-yellow-500'
                          }`}>
                            {marketTrend.trend.charAt(0).toUpperCase() + marketTrend.trend.slice(1)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No market trend data available</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
