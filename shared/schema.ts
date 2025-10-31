import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Portfolio holdings
export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  quantity: real("quantity").notNull(),
  avgPrice: real("avg_price").notNull(),
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
});

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfolios.$inferSelect;

// Trade alerts
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // 'buy' | 'sell' | 'hold'
  message: text("message").notNull(),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  dismissed: boolean("dismissed").default(false).notNull(),
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

// Market data types (not stored in DB, used for API responses)
export const marketDataSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  changePercent: z.number(),
  volume: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  open: z.number().optional(),
  previousClose: z.number().optional(),
});

export type MarketData = z.infer<typeof marketDataSchema>;

// Historical price data
export const historicalDataSchema = z.object({
  date: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export type HistoricalData = z.infer<typeof historicalDataSchema>;

// Technical indicators
export const indicatorsSchema = z.object({
  rsi: z.number(),
  sma20: z.number(),
  sma50: z.number(),
  bollingerUpper: z.number(),
  bollingerLower: z.number(),
  bollingerMiddle: z.number(),
});

export type Indicators = z.infer<typeof indicatorsSchema>;

// AI Forecast
export const forecastSchema = z.object({
  symbol: z.string(),
  currentPrice: z.number(),
  predictedPrice: z.number(),
  targetDate: z.string(),
  confidence: z.number(),
  trend: z.enum(['bullish', 'bearish', 'neutral']),
  reasoning: z.string(),
  keyFactors: z.array(z.string()),
});

export type Forecast = z.infer<typeof forecastSchema>;

// Sentiment analysis
export const sentimentSchema = z.object({
  symbol: z.string(),
  score: z.number(), // -1 to 1
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  confidence: z.number(),
  summary: z.string(),
  newsHeadlines: z.array(z.object({
    title: z.string(),
    sentiment: z.string(),
  })),
});

export type Sentiment = z.infer<typeof sentimentSchema>;

// Options pricing
export const optionsPriceSchema = z.object({
  callPrice: z.number(),
  putPrice: z.number(),
  delta: z.number(),
  gamma: z.number(),
  theta: z.number(),
  vega: z.number(),
  rho: z.number(),
});

export type OptionsPrice = z.infer<typeof optionsPriceSchema>;
