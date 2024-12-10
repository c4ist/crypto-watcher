export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  sparkline_in_7d: {
    price: number[];
  };
  image: string;
}

export interface PredictionData {
  timestamp: string;
  predicted_price: number;
  confidence: number;
}

export interface MarketTrend {
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number;
  indicators: {
    rsi: number;
    macd: number;
    volume: number;
  };
}
