import { DashboardHeader } from "@/components/dashboard-header";
import { OptionsCalculator } from "@/components/options-calculator";
import { StockPriceChart } from "@/components/stock-price-chart";
import { StockDataCard } from "@/components/stock-data-card";
import { ForecastCard } from "@/components/forecast-card";
import { SentimentCard } from "@/components/sentiment-card";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container px-4 md:px-6 lg:px-8 py-8 space-y-8">
        <OptionsCalculator />
        
        <StockPriceChart />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <StockDataCard />
          <ForecastCard />
          <SentimentCard />
        </div>
      </main>
    </div>
  );
}
