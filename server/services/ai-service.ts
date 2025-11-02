import OpenAI from 'openai';
import type { Forecast, Sentiment } from '@shared/schema';

export type AIProvider = 'OpenAI' | 'Mock Data';
export type AIProviderStatus = 'active' | 'fallback' | 'error' | 'offline';

interface AIProviderResult<T> {
  data: T;
  provider: AIProvider;
  status: AIProviderStatus;
}

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (openaiClient) return openaiClient;
  
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('OpenAI API key not found, using fallback methods');
    return null;
  }

  try {
    openaiClient = new OpenAI({ apiKey });
    return openaiClient;
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
    return null;
  }
}

// AI-powered forecast using OpenAI
async function generateAIForecast(
  symbol: string,
  currentPrice: number,
  historicalData: Array<{ date: string; price: number }>
): Promise<Forecast | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const recentPrices = historicalData.slice(-10).map(d => d.price);
    const prompt = `You are a financial analyst. Given the stock symbol ${symbol} with current price $${currentPrice.toFixed(2)} and recent price history: ${recentPrices.map(p => `$${p.toFixed(2)}`).join(', ')}.

Provide a 30-day price forecast. Respond ONLY with a JSON object in this exact format:
{
  "prediction": <predicted price as number>,
  "confidence": <confidence percentage 0-100 as number>,
  "reasoning": "<brief 1-sentence explanation>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      prediction: result.prediction,
      confidence: Math.min(100, Math.max(0, result.confidence)),
      timeframe: '30 days',
      method: 'ai',
    };
  } catch (error) {
    console.error('OpenAI forecast error:', error);
    return null;
  }
}

// AI-powered sentiment analysis using OpenAI
async function generateAISentiment(symbol: string, currentPrice: number): Promise<Sentiment | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const prompt = `You are a financial sentiment analyst. Analyze the market sentiment for stock ${symbol} currently trading at $${currentPrice.toFixed(2)}.

Provide a sentiment analysis. Respond ONLY with a JSON object in this exact format:
{
  "score": <sentiment score 0-100 as number, where 0=very bearish, 50=neutral, 100=very bullish>,
  "analysis": "<brief 2-3 sentence analysis of market sentiment>"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 250,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      score: Math.min(100, Math.max(0, result.score)),
      analysis: result.analysis,
      method: 'ai',
    };
  } catch (error) {
    console.error('OpenAI sentiment error:', error);
    return null;
  }
}

// Statistical fallback forecast
function generateStatisticalForecast(
  currentPrice: number,
  historicalData: Array<{ date: string; price: number }>
): Forecast {
  const recentPrices = historicalData.slice(-10).map(d => d.price);
  
  // Simple linear regression
  const n = recentPrices.length;
  const sumX = (n * (n + 1)) / 2;
  const sumY = recentPrices.reduce((a, b) => a + b, 0);
  const sumXY = recentPrices.reduce((sum, price, i) => sum + (i + 1) * price, 0);
  const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const prediction = slope * (n + 30) + intercept;
  const avgPrice = sumY / n;
  const variance = recentPrices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / n;
  const confidence = Math.max(40, Math.min(80, 100 - (Math.sqrt(variance) / avgPrice) * 100));
  
  return {
    prediction: Math.max(0, prediction),
    confidence: Math.round(confidence),
    timeframe: '30 days',
    method: 'statistical',
  };
}

// Basic sentiment fallback
function generateBasicSentiment(
  currentPrice: number,
  historicalData: Array<{ date: string; price: number }>
): Sentiment {
  const recentPrices = historicalData.slice(-5).map(d => d.price);
  const avgRecent = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
  const priceChange = ((currentPrice - avgRecent) / avgRecent) * 100;
  
  let score = 50; // neutral
  let analysis = 'Market sentiment is neutral based on recent price action.';
  
  if (priceChange > 5) {
    score = 75;
    analysis = 'Market sentiment is bullish based on strong recent price momentum and positive trend indicators.';
  } else if (priceChange > 2) {
    score = 65;
    analysis = 'Market sentiment is moderately bullish with positive price movement observed in recent trading.';
  } else if (priceChange < -5) {
    score = 25;
    analysis = 'Market sentiment is bearish due to recent price decline and negative momentum indicators.';
  } else if (priceChange < -2) {
    score = 35;
    analysis = 'Market sentiment is moderately bearish with recent price weakness in trading sessions.';
  }
  
  return {
    score,
    analysis,
    method: 'basic',
  };
}

// Mock data fallback
function generateMockForecast(): Forecast {
  const prediction = 180 + Math.random() * 20;
  const confidence = 70 + Math.random() * 15;
  
  return {
    prediction: parseFloat(prediction.toFixed(2)),
    confidence: Math.round(confidence),
    timeframe: '30 days',
    method: 'mock',
  };
}

function generateMockSentiment(): Sentiment {
  const score = 60 + Math.random() * 25;
  
  return {
    score: Math.round(score),
    analysis: 'Market sentiment appears positive based on technical indicators and recent trading patterns. Investor confidence remains steady.',
    method: 'mock',
  };
}

// Main functions with fallback
export async function getForecast(
  symbol: string,
  currentPrice: number,
  historicalData: Array<{ date: string; price: number }>
): Promise<AIProviderResult<Forecast>> {
  // Try AI-powered forecast
  const aiForecast = await generateAIForecast(symbol, currentPrice, historicalData);
  if (aiForecast) {
    return { data: aiForecast, provider: 'OpenAI', status: 'active' };
  }

  // Fallback to statistical method if we have enough data
  if (historicalData.length >= 10) {
    return {
      data: generateStatisticalForecast(currentPrice, historicalData),
      provider: 'Mock Data',
      status: 'fallback',
    };
  }

  // Last resort: mock data
  return {
    data: generateMockForecast(),
    provider: 'Mock Data',
    status: 'offline',
  };
}

export async function getSentiment(
  symbol: string,
  currentPrice: number,
  historicalData: Array<{ date: string; price: number }>
): Promise<AIProviderResult<Sentiment>> {
  // Try AI-powered sentiment
  const aiSentiment = await generateAISentiment(symbol, currentPrice);
  if (aiSentiment) {
    return { data: aiSentiment, provider: 'OpenAI', status: 'active' };
  }

  // Fallback to basic sentiment if we have enough data
  if (historicalData.length >= 5) {
    return {
      data: generateBasicSentiment(currentPrice, historicalData),
      provider: 'Mock Data',
      status: 'fallback',
    };
  }

  // Last resort: mock data
  return {
    data: generateMockSentiment(),
    provider: 'Mock Data',
    status: 'offline',
  };
}
