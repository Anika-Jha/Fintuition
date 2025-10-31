import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPortfolioSchema, insertAlertSchema } from "@shared/schema";
import { getCurrentPrice, getHistoricalData, calculateTechnicalIndicators } from "./services/market-data";
import { generateForecast, analyzeSentiment, generateTradeAlert } from "./services/openai";
import { calculateBlackScholes } from "./services/options-pricing";

export async function registerRoutes(app: Express): Promise<Server> {
  // Price endpoints
  app.get("/api/price/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const data = await getCurrentPrice(symbol.toUpperCase());
      res.json(data);
    } catch (error) {
      console.error("Price fetch error:", error);
      res.status(500).json({ error: "Failed to fetch price data" });
    }
  });

  app.get("/api/price/:symbol/historical", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = '1mo' } = req.query;
      const data = await getHistoricalData(symbol.toUpperCase(), period as string);
      res.json(data);
    } catch (error) {
      console.error("Historical data fetch error:", error);
      res.status(500).json({ error: "Failed to fetch historical data" });
    }
  });

  // Portfolio prices endpoint (batch fetch)
  app.get("/api/portfolio/prices/:symbols", async (req, res) => {
    try {
      const symbols = req.params.symbols.split(',').filter(s => s.trim());
      const prices = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            return await getCurrentPrice(symbol.toUpperCase());
          } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
            return null;
          }
        })
      );
      res.json(prices.filter(p => p !== null));
    } catch (error) {
      console.error("Batch price fetch error:", error);
      res.status(500).json({ error: "Failed to fetch prices" });
    }
  });

  // Technical indicators
  app.get("/api/indicators/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const historicalData = await getHistoricalData(symbol.toUpperCase(), '3mo');
      const indicators = calculateTechnicalIndicators(historicalData);
      res.json(indicators);
    } catch (error) {
      console.error("Indicators calculation error:", error);
      res.status(500).json({ error: "Failed to calculate indicators" });
    }
  });

  // AI Forecast
  app.get("/api/predict/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const priceData = await getCurrentPrice(symbol.toUpperCase());
      const historicalData = await getHistoricalData(symbol.toUpperCase(), '3mo');
      const forecast = await generateForecast(symbol.toUpperCase(), priceData.price, historicalData);
      res.json(forecast);
    } catch (error) {
      console.error("Forecast generation error:", error);
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  });

  // Sentiment Analysis
  app.get("/api/sentiment/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const sentiment = await analyzeSentiment(symbol.toUpperCase());
      res.json(sentiment);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      res.status(500).json({ error: "Failed to analyze sentiment" });
    }
  });

  // Portfolio CRUD
  app.get("/api/portfolio", async (_req, res) => {
    try {
      const portfolios = await storage.getPortfolios();
      res.json(portfolios);
    } catch (error) {
      console.error("Portfolio fetch error:", error);
      res.status(500).json({ error: "Failed to fetch portfolio" });
    }
  });

  app.post("/api/portfolio", async (req, res) => {
    try {
      const validated = insertPortfolioSchema.parse(req.body);
      const portfolio = await storage.createPortfolio(validated);
      res.json(portfolio);
    } catch (error) {
      console.error("Portfolio creation error:", error);
      res.status(400).json({ error: "Invalid portfolio data" });
    }
  });

  app.delete("/api/portfolio/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePortfolio(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Portfolio not found" });
      }
    } catch (error) {
      console.error("Portfolio deletion error:", error);
      res.status(500).json({ error: "Failed to delete portfolio" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (_req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Alerts fetch error:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts/generate/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const priceData = await getCurrentPrice(symbol.toUpperCase());
      const historicalData = await getHistoricalData(symbol.toUpperCase(), '1mo');
      const forecast = await generateForecast(symbol.toUpperCase(), priceData.price, historicalData);
      const sentiment = await analyzeSentiment(symbol.toUpperCase());
      
      const alertData = await generateTradeAlert(
        symbol.toUpperCase(),
        priceData.price,
        forecast,
        sentiment
      );
      
      const alert = await storage.createAlert({
        symbol: alertData.symbol,
        type: alertData.type,
        message: alertData.message,
        confidence: alertData.confidence,
        dismissed: false,
      });
      
      res.json(alert);
    } catch (error) {
      console.error("Alert generation error:", error);
      res.status(500).json({ error: "Failed to generate alert" });
    }
  });

  app.post("/api/alerts/:id/dismiss", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.dismissAlert(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Alert not found" });
      }
    } catch (error) {
      console.error("Alert dismissal error:", error);
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  // Options Pricing
  app.post("/api/options/calculate", async (req, res) => {
    try {
      const { stockPrice, strikePrice, daysToExpiry, volatility, riskFreeRate } = req.body;
      
      const result = calculateBlackScholes({
        stockPrice,
        strikePrice,
        daysToExpiry,
        volatility,
        riskFreeRate,
      });
      
      res.json(result);
    } catch (error) {
      console.error("Options calculation error:", error);
      res.status(400).json({ error: "Failed to calculate option prices" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
