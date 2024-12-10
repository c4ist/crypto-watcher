import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CryptoCard } from './components/CryptoCard';
import { api } from './services/api';
import { CryptoAsset } from './types/crypto';

function App() {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null);

  const { data: cryptos, isLoading, error } = useQuery({
    queryKey: ['cryptos'],
    queryFn: () => api.getTopCryptos(20),
  });

  const { data: marketTrend, isLoading: isLoadingMarketTrend } = useQuery({
    queryKey: ['trend', selectedCrypto?.id],
    queryFn: () => selectedCrypto ? api.getMarketTrend(selectedCrypto.id) : Promise.resolve(null),
    enabled: !!selectedCrypto,
  });

  const { data: predictions, isLoading: isLoadingPredictions } = useQuery({
    queryKey: ['predictions', selectedCrypto?.id],
    queryFn: () => selectedCrypto ? api.getPrediction(selectedCrypto.id) : Promise.resolve([]),
    enabled: !!selectedCrypto,
  });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-danger mb-2">Error Loading Data</h2>
          <p className="text-neutral">
            {error instanceof Error ? error.message : 'Failed to fetch cryptocurrency data'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B1120]">
      {/* Enhanced background gradient */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-4"
          >
            Crypto Price Tracker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral text-lg"
          >
            Monitor cryptocurrency prices in real-time and get AI-powered market predictions
          </motion.p>
        </header>

        <div className="max-w-[1400px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mx-auto max-w-7xl">
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-[#151C2F] animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-700 rounded"></div>
                      <div className="h-3 w-16 bg-gray-700 rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-700 rounded mt-4"></div>
                </motion.div>
              ))}
            </div>
          ) : cryptos && cryptos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-auto gap-4 mx-auto max-w-7xl">
              <AnimatePresence>
                {cryptos.map((crypto) => {
                  const isSelected = selectedCrypto?.id === crypto.id;
                  return (
                    <CryptoCard
                      key={crypto.id}
                      crypto={crypto}
                      onClick={() => setSelectedCrypto(isSelected ? null : crypto)}
                      isExpanded={isSelected}
                      predictions={isSelected ? predictions : undefined}
                      isLoadingPredictions={isLoadingPredictions}
                      marketTrend={isSelected ? (marketTrend ?? undefined) : undefined}
                      isLoadingMarketTrend={isLoadingMarketTrend}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center text-neutral">
              No cryptocurrencies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
