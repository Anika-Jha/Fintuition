import yahooFinance from 'yahoo-finance2';
import type { StockData, HistoricalData, HistoricalPrice } from '@shared/schema';

export type APIProvider = 'Yahoo Finance' | 'Alpha Vantage' | 'Finnhub' | 'Mock Data';
export type APIProviderStatus = 'active' | 'fallback' | 'error' | 'offline';

interface ProviderResult<T> {
  data: T | null;
  provider: APIProvider;
  status: APIProviderStatus;
}

// Yahoo Finance implementation
async function fetchFromYahoo(symbol: string): Promise<StockData | null> {
  try {
    const quote = await yahooFinance.quote(symbol);
    
    if (!quote || !quote.regularMarketPrice) {
      return null;
    }

    return {
      symbol: quote.symbol,
      currentPrice: quote.regularMarketPrice,
      priceChange: quote.regularMarketChange || 0,
      priceChangePercent: quote.regularMarketChangePercent || 0,
      volume: formatVolume(quote.regularMarketVolume || 0),
      high: quote.regularMarketDayHigh || quote.regularMarketPrice,
      low: quote.regularMarketDayLow || quote.regularMarketPrice,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      marketCap: formatVolume(quote.marketCap || 0),
    };
  } catch (error) {
    console.error('Yahoo Finance error:', error);
    return null;
  }
}

async function fetchHistoricalFromYahoo(symbol: string, period: string): Promise<HistoricalPrice[] | null> {
  try {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '1D':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1W':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3M':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const result = await yahooFinance.chart(symbol, {
      period1: startDate,
      period2: now,
      interval: period === '1D' ? '1h' : '1d',
    });

    if (!result || !result.quotes || result.quotes.length === 0) {
      return null;
    }

    return result.quotes
      .filter(quote => quote.close !== null && quote.close !== undefined)
      .map(quote => ({
        date: new Date(quote.date).toLocaleDateString(),
        price: quote.close!,
      }));
  } catch (error) {
    console.error('Yahoo Finance historical data error:', error);
    return null;
  }
}

// Alpha Vantage implementation (requires API key)
async function fetchFromAlphaVantage(symbol: string): Promise<StockData | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    console.log('Alpha Vantage API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    const data = await response.json();
    
    if (!data['Global Quote'] || !data['Global Quote']['05. price']) {
      return null;
    }

    const quote = data['Global Quote'];
    return {
      symbol: quote['01. symbol'],
      currentPrice: parseFloat(quote['05. price']),
      priceChange: parseFloat(quote['09. change']),
      priceChangePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: formatVolume(parseInt(quote['06. volume'])),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      previousClose: parseFloat(quote['08. previous close']),
    };
  } catch (error) {
    console.error('Alpha Vantage error:', error);
    return null;
  }
}

// Finnhub implementation (requires API key)
async function fetchFromFinnhub(symbol: string): Promise<StockData | null> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    console.log('Finnhub API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    const data = await response.json();
    
    if (!data.c || data.c === 0) {
      return null;
    }

    return {
      symbol,
      currentPrice: data.c,
      priceChange: data.d || 0,
      priceChangePercent: data.dp || 0,
      volume: 'N/A',
      high: data.h || data.c,
      low: data.l || data.c,
      open: data.o || data.c,
      previousClose: data.pc || data.c,
    };
  } catch (error) {
    console.error('Finnhub error:', error);
    return null;
  }
}

// Mock data fallback
function generateMockStockData(symbol: string): StockData {
  const basePrice = 100 + Math.random() * 100;
  const change = (Math.random() - 0.5) * 10;
  
  return {
    symbol,
    currentPrice: parseFloat(basePrice.toFixed(2)),
    priceChange: parseFloat(change.toFixed(2)),
    priceChangePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
    volume: formatVolume(Math.floor(Math.random() * 100000000)),
    high: parseFloat((basePrice + Math.abs(change) * 0.5).toFixed(2)),
    low: parseFloat((basePrice - Math.abs(change) * 0.5).toFixed(2)),
    open: parseFloat((basePrice - change * 0.3).toFixed(2)),
    previousClose: parseFloat((basePrice - change).toFixed(2)),
  };
}

function generateMockHistoricalData(period: string): HistoricalPrice[] {
  const dataPoints = period === '1D' ? 24 : period === '1W' ? 7 : period === '1M' ? 30 : period === '3M' ? 90 : 252;
  const basePrice = 100;
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const volatility = 0.02;
    const trend = 0.0001;
    const randomWalk = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + trend * i + randomWalk);
    
    return {
      date: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: parseFloat(price.toFixed(2)),
    };
  });
}

// Format volume numbers
function formatVolume(volume: number): string {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`;
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
}

// Main function with fallback chain
export async function getStockData(symbol: string): Promise<ProviderResult<StockData>> {
  // Try Yahoo Finance first
  let data = await fetchFromYahoo(symbol);
  if (data) {
    return { data, provider: 'Yahoo Finance', status: 'active' };
  }

  // Try Alpha Vantage as fallback
  data = await fetchFromAlphaVantage(symbol);
  if (data) {
    return { data, provider: 'Alpha Vantage', status: 'fallback' };
  }

  // Try Finnhub as second fallback
  data = await fetchFromFinnhub(symbol);
  if (data) {
    return { data, provider: 'Finnhub', status: 'fallback' };
  }

  // Use mock data as last resort
  return {
    data: generateMockStockData(symbol),
    provider: 'Mock Data',
    status: 'offline',
  };
}

export async function getHistoricalData(symbol: string, period: string): Promise<ProviderResult<HistoricalData>> {
  // Try Yahoo Finance
  const historicalPrices = await fetchHistoricalFromYahoo(symbol, period);
  
  if (historicalPrices && historicalPrices.length > 0) {
    return {
      data: {
        symbol,
        period: period as any,
        data: historicalPrices,
      },
      provider: 'Yahoo Finance',
      status: 'active',
    };
  }

  // Fallback to mock data
  return {
    data: {
      symbol,
      period: period as any,
      data: generateMockHistoricalData(period),
    },
    provider: 'Mock Data',
    status: 'offline',
  };
}
