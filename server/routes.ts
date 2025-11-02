import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getStockData, getHistoricalData } from "./services/stock-api";
import { getForecast, getSentiment } from "./services/ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get stock quote data
  app.get("/api/stock/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const result = await getStockData(symbol.toUpperCase());
      
      if (!result.data) {
        return res.status(404).json({ error: "Stock not found" });
      }

      res.json({
        data: result.data,
        provider: result.provider,
        status: result.status,
      });
    } catch (error) {
      console.error("Stock data error:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });

  // Get historical chart data
  app.get("/api/chart/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = "1M" } = req.query;
      
      const result = await getHistoricalData(symbol.toUpperCase(), period as string);
      
      if (!result.data) {
        return res.status(404).json({ error: "Chart data not found" });
      }

      res.json({
        data: result.data,
        provider: result.provider,
        status: result.status,
      });
    } catch (error) {
      console.error("Chart data error:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Get AI forecast
  app.get("/api/forecast/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Get current stock data and historical data for analysis
      const stockResult = await getStockData(symbol.toUpperCase());
      const historicalResult = await getHistoricalData(symbol.toUpperCase(), "1M");
      
      if (!stockResult.data || !historicalResult.data) {
        return res.status(404).json({ error: "Unable to generate forecast" });
      }

      const forecastResult = await getForecast(
        symbol.toUpperCase(),
        stockResult.data.currentPrice,
        historicalResult.data.data
      );

      res.json({
        data: forecastResult.data,
        provider: forecastResult.provider,
        status: forecastResult.status,
      });
    } catch (error) {
      console.error("Forecast error:", error);
      res.status(500).json({ error: "Failed to generate forecast" });
    }
  });

  // Get sentiment analysis
  app.get("/api/sentiment/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      // Get current stock data and historical data for analysis
      const stockResult = await getStockData(symbol.toUpperCase());
      const historicalResult = await getHistoricalData(symbol.toUpperCase(), "1W");
      
      if (!stockResult.data || !historicalResult.data) {
        return res.status(404).json({ error: "Unable to generate sentiment" });
      }

      const sentimentResult = await getSentiment(
        symbol.toUpperCase(),
        stockResult.data.currentPrice,
        historicalResult.data.data
      );

      res.json({
        data: sentimentResult.data,
        provider: sentimentResult.provider,
        status: sentimentResult.status,
      });
    } catch (error) {
      console.error("Sentiment error:", error);
      res.status(500).json({ error: "Failed to generate sentiment analysis" });
    }
  });

  // Get all data for a symbol (stock + chart + forecast + sentiment)
  app.get("/api/dashboard/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { period = "1M" } = req.query;
      
      // Fetch all data in parallel
      const [stockResult, historicalResult] = await Promise.all([
        getStockData(symbol.toUpperCase()),
        getHistoricalData(symbol.toUpperCase(), period as string),
      ]);

      if (!stockResult.data || !historicalResult.data) {
        return res.status(404).json({ error: "Stock not found" });
      }

      // Fetch forecast and sentiment in parallel
      const [forecastResult, sentimentResult] = await Promise.all([
        getForecast(symbol.toUpperCase(), stockResult.data.currentPrice, historicalResult.data.data),
        getSentiment(symbol.toUpperCase(), stockResult.data.currentPrice, historicalResult.data.data),
      ]);

      res.json({
        stock: {
          data: stockResult.data,
          provider: stockResult.provider,
          status: stockResult.status,
        },
        chart: {
          data: historicalResult.data,
          provider: historicalResult.provider,
          status: historicalResult.status,
        },
        forecast: {
          data: forecastResult.data,
          provider: forecastResult.provider,
          status: forecastResult.status,
        },
        sentiment: {
          data: sentimentResult.data,
          provider: sentimentResult.provider,
          status: sentimentResult.status,
        },
      });
    } catch (error) {
      console.error("Dashboard data error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
