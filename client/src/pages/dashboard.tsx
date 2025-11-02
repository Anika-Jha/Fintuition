import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { OptionsCalculator } from "@/components/options-calculator";
import { StockPriceChart } from "@/components/stock-price-chart";
import { StockDataCard } from "@/components/stock-data-card";
import { ForecastCard } from "@/components/forecast-card";
import { SentimentCard } from "@/components/sentiment-card";
import { useDashboardData } from "@/hooks/use-stock-data";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [symbol, setSymbol] = useState("AAPL");
  const [period, setPeriod] = useState("1M");
  
  const { data, isLoading, error } = useDashboardData(symbol, period);

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol.toUpperCase());
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onSymbolChange={handleSymbolChange} currentSymbol={symbol} />
      
      <main className="container px-4 md:px-6 lg:px-8 py-8 space-y-8">
        <OptionsCalculator />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading market data...</span>
          </div>
        ) : error ? (
          <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-destructive">Failed to load market data. Please try again.</p>
          </div>
        ) : data ? (
          <>
            <StockPriceChart
              symbol={symbol}
              data={data.chart.data.data}
              apiProvider={data.chart.provider as any}
              apiStatus={data.chart.status as any}
              onPeriodChange={handlePeriodChange}
              currentPeriod={period}
            />
            
            <div className="grid lg:grid-cols-3 gap-6">
              <StockDataCard
                symbol={data.stock.data.symbol}
                currentPrice={data.stock.data.currentPrice}
                priceChange={data.stock.data.priceChange}
                priceChangePercent={data.stock.data.priceChangePercent}
                volume={data.stock.data.volume}
                high={data.stock.data.high}
                low={data.stock.data.low}
                apiProvider={data.stock.provider as any}
                apiStatus={data.stock.status as any}
              />
              <ForecastCard
                prediction={data.forecast.data.prediction}
                confidence={data.forecast.data.confidence}
                timeframe={data.forecast.data.timeframe}
                apiProvider={data.forecast.provider as any}
                apiStatus={data.forecast.status as any}
              />
              <SentimentCard
                score={data.sentiment.data.score}
                analysis={data.sentiment.data.analysis}
                apiProvider={data.sentiment.provider as any}
                apiStatus={data.sentiment.status as any}
              />
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
