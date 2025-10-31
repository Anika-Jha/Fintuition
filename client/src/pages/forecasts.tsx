import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ForecastPanel } from "@/components/forecast-panel";
import { SentimentGauge } from "@/components/sentiment-gauge";
import { StockChart } from "@/components/stock-chart";
import type { Forecast, Sentiment, HistoricalData } from "@shared/schema";

export default function ForecastsPage() {
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

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

  const popularStocks = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Forecasts</h1>
        <p className="text-muted-foreground">
          AI-powered price predictions and sentiment analysis
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stock symbol..."
            value={searchSymbol}
            onChange={(e) => setSearchSymbol(e.target.value)}
            className="pl-10"
            data-testid="input-forecast-search"
          />
        </div>
        <Button type="submit" data-testid="button-forecast-search">
          Analyze
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
              data-testid={`button-forecast-${symbol}`}
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastPanel forecast={forecast} isLoading={forecastLoading} />
        <SentimentGauge sentiment={sentiment} isLoading={sentimentLoading} />
      </div>

      <StockChart symbol={selectedSymbol} />
    </div>
  );
}
