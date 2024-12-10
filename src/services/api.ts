import axios from 'axios';
import { CryptoAsset, PredictionData, MarketTrend } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const instance = axios.create({
  baseURL: COINGECKO_API,
  timeout: 10000,
});

export const api = {
  getTopCryptos: async (limit: number = 20): Promise<CryptoAsset[]> => {
    try {
      const response = await instance.get('/coins/markets', {
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
  async getPrediction(cryptoId: string): Promise<PredictionData[]> {
    // Simulated API call - replace with actual prediction API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currentDate = new Date();
    const predictions: PredictionData[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      
      predictions.push({
        timestamp: date.toISOString(),
        predicted_price: 1000 + Math.random() * 500, // Mock price
        confidence: 0.7 + Math.random() * 0.3,
      });
    }
    
    return predictions;
  },

  async getMarketTrend(cryptoId: string): Promise<MarketTrend> {
    // Simulated API call - replace with actual API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data for demonstration
    const rsi = 30 + Math.random() * 40;
    const macd = -2 + Math.random() * 4;
    const volumeChange = -20 + Math.random() * 40;
    
    let trend: 'bullish' | 'bearish' | 'neutral';
    if (rsi > 60 && macd > 0) {
      trend = 'bullish';
    } else if (rsi < 40 && macd < 0) {
      trend = 'bearish';
    } else {
      trend = 'neutral';
    }
    
    return {
      rsi,
      macd,
      volumeChange,
      trend,
    };
  }
};
