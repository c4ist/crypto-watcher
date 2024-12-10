import axios from 'axios';
import { CryptoAsset, PredictionData, MarketTrend } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const axiosInstance = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000,
});

export const api = {
  getTopCryptos: async (limit: number = 20): Promise<CryptoAsset[]> => {
    try {
      const response = await axiosInstance.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h,7d'
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch cryptocurrency data');
      }
      throw error;
    }
  },

  // Simulated prediction data (replace with actual ML model in production)
  getPrediction: async (coinId: string): Promise<PredictionData[]> => {
    try {
      const currentPrice = (await api.getTopCryptos(100))
        .find(crypto => crypto.id === coinId)?.current_price || 0;

      return Array.from({ length: 7 }, (_, i) => ({
        timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
        predicted_price: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
        confidence: 0.7 + Math.random() * 0.2
      }));
    } catch (error) {
      throw new Error('Failed to generate price predictions');
    }
  },

  // Simulated market trend analysis (replace with actual analysis in production)
  getMarketTrend: async (coinId: string): Promise<MarketTrend> => {
    try {
      const rsi = 30 + Math.random() * 40;
      const macd = -5 + Math.random() * 10;
      const volume = Math.random() * 1000000;

      let trend: 'bullish' | 'bearish' | 'neutral';
      if (rsi > 60) trend = 'bullish';
      else if (rsi < 40) trend = 'bearish';
      else trend = 'neutral';

      return {
        trend,
        strength: Math.random() * 100,
        indicators: {
          rsi,
          macd,
          volume
        }
      };
    } catch (error) {
      throw new Error('Failed to analyze market trends');
    }
  }
};
