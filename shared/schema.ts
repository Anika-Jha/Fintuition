import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Stock Data Types
export const stockDataSchema = z.object({
  symbol: z.string(),
  currentPrice: z.number(),
  priceChange: z.number(),
  priceChangePercent: z.number(),
  volume: z.string(),
  high: z.number(),
  low: z.number(),
  open: z.number().optional(),
  previousClose: z.number().optional(),
  marketCap: z.string().optional(),
});

export type StockData = z.infer<typeof stockDataSchema>;

// Historical Price Data
export const historicalPriceSchema = z.object({
  date: z.string(),
  price: z.number(),
});

export const historicalDataSchema = z.object({
  symbol: z.string(),
  period: z.enum(["1D", "1W", "1M", "3M", "1Y"]),
  data: z.array(historicalPriceSchema),
});

export type HistoricalPrice = z.infer<typeof historicalPriceSchema>;
export type HistoricalData = z.infer<typeof historicalDataSchema>;

// Forecast Data
export const forecastSchema = z.object({
  prediction: z.number(),
  confidence: z.number().min(0).max(100),
  timeframe: z.string(),
  method: z.enum(["ai", "statistical", "mock"]),
});

export type Forecast = z.infer<typeof forecastSchema>;

// Sentiment Analysis
export const sentimentSchema = z.object({
  score: z.number().min(0).max(100),
  analysis: z.string(),
  method: z.enum(["ai", "basic", "mock"]),
});

export type Sentiment = z.infer<typeof sentimentSchema>;

// API Status
export const apiStatusSchema = z.object({
  stockData: z.object({
    provider: z.enum(["Yahoo Finance", "Alpha Vantage", "Finnhub", "Mock Data"]),
    status: z.enum(["active", "fallback", "error", "offline"]),
  }),
  forecast: z.object({
    provider: z.enum(["OpenAI", "Mock Data"]),
    status: z.enum(["active", "fallback", "error", "offline"]),
  }),
  sentiment: z.object({
    provider: z.enum(["OpenAI", "Mock Data"]),
    status: z.enum(["active", "fallback", "error", "offline"]),
  }),
});

export type APIStatus = z.infer<typeof apiStatusSchema>;
