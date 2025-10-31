import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { PriceCard } from "@/components/price-card";
import { StockChart } from "@/components/stock-chart";
import { TechnicalIndicators } from "@/components/technical-indicators";
import { ForecastPanel } from "@/components/forecast-panel";
import { SentimentGauge } from "@/components/sentiment-gauge";
import type { MarketData, HistoricalData, Indicators, Forecast, Sentiment } from "@shared/schema";

export default function Dashboard() {
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const { data: marketData, isLoading: marketLoading } = useQuery<MarketData>({
    queryKey: ["/api/price", selectedSymbol],
    enabled: !!selectedSymbol,
  });


  const { data: indicators, isLoading: indicatorsLoading } = useQuery<Indicators>({
    queryKey: ["/api/indicators", selectedSymbol],
    enabled: !!selectedSymbol,
  });

  const { data: forecast, isLoading: forecastLoading } = useQuery<Forecast>({
    queryKey: ["/api/predict", selectedSymbol],
    enabled: !!selectedSymbol,
  });

  const { data: sentiment, isLoading: sentimentLoading } = useQuery<Sentiment>({
    queryKey: ["/api/sentiment", selectedSymbol],
    enabled: !!selectedSymbol,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSymbol.trim()) {
      setSelectedSymbol(searchSymbol.toUpperCase().trim());
      setSearchSymbol("");
    }
  };

  const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time market data and AI-powered insights
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stock symbol (e.g., AAPL, TSLA)..."
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="pl-10"
            data-testid="input-search-symbol"
          />
        </div>
        <Button type="submit" data-testid="button-search">
          Search
        </Button>
      </form>

      <div>
        <div className="text-sm text-muted-foreground mb-2">Popular Stocks</div>
        <div className="flex flex-wrap gap-2">
          {popularStocks.map((symbol) => (
            <Button
              key={symbol}
              variant={selectedSymbol === symbol ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSymbol(symbol)}
              data-testid={`button-stock-${symbol}`}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PriceCard
          symbol={selectedSymbol}
          price={marketData?.price}
          change={marketData?.change}
          changePercent={marketData?.changePercent}
          isLoading={marketLoading}
        />
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-1">Volume</div>
              <div className="text-2xl font-bold font-mono">
                {marketData?.volume ? (marketData.volume / 1000000).toFixed(2) + 'M' : '--'}
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm text-muted-foreground mb-1">High / Low</div>
              <div className="text-lg font-mono">
                {marketData?.high?.toFixed(2) ?? '--'} / {marketData?.low?.toFixed(2) ?? '--'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockChart symbol={selectedSymbol} />
          <TechnicalIndicators
            indicators={indicators}
            symbol={selectedSymbol}
            isLoading={indicatorsLoading}
          />
        </div>
        <div className="space-y-6">
          <ForecastPanel forecast={forecast} isLoading={forecastLoading} />
          <SentimentGauge sentiment={sentiment} isLoading={sentimentLoading} />
        </div>
      </div>
    </div>
  );
}
