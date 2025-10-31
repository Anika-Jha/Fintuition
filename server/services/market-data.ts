import yahooFinance from 'yahoo-finance2';

export async function getCurrentPrice(symbol: string) {
  try {
    const quote = await yahooFinance.quote(symbol, {}, { validateResult: false });
    
    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw new Error(`Failed to fetch price for ${symbol}`);
  }
}

export async function getHistoricalData(symbol: string, period: string = '1mo') {
  try {
    const queryOptions = {
      period1: getStartDate(period),
      period2: new Date(),
    };
    
    const result = await yahooFinance.historical(symbol, queryOptions, { validateResult: false });
    
    return result.map((item: any) => ({
      date: item.date.toISOString().split('T')[0],
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw new Error(`Failed to fetch historical data for ${symbol}`);
  }
}

function getStartDate(period: string): Date {
  const now = new Date();
  switch (period) {
    case '1d':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case '1w':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '1mo':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '3mo':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case '1y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

export function calculateTechnicalIndicators(historicalData: any[]) {
  if (historicalData.length < 50) {
    throw new Error('Insufficient data for technical indicators');
  }

  const prices = historicalData.map(d => d.close);
  
  // RSI calculation
  const rsi = calculateRSI(prices, 14);
  
  // Simple Moving Averages
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);
  
  // Bollinger Bands
  const bb = calculateBollingerBands(prices, 20, 2);
  
  return {
    rsi,
    sma20,
    sma50,
    bollingerUpper: bb.upper,
    bollingerMiddle: bb.middle,
    bollingerLower: bb.lower,
  };
}

function calculateRSI(prices: number[], period: number = 14): number {
  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? Math.abs(change) : 0);
  
  const avgGain = gains.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  const avgLoss = losses.slice(-period).reduce((sum, val) => sum + val, 0) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateSMA(prices: number[], period: number): number {
  const relevantPrices = prices.slice(-period);
  return relevantPrices.reduce((sum, price) => sum + price, 0) / period;
}

function calculateBollingerBands(prices: number[], period: number, stdDev: number) {
  const sma = calculateSMA(prices, period);
  const relevantPrices = prices.slice(-period);
  
  const squaredDiffs = relevantPrices.map(price => Math.pow(price - sma, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    upper: sma + (standardDeviation * stdDev),
    middle: sma,
    lower: sma - (standardDeviation * stdDev),
  };
}
