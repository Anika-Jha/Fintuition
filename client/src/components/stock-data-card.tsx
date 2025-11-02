import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { APIStatusBadge, type APIProvider, type APIStatus } from "./api-status-badge";

interface StockDataCardProps {
  symbol?: string;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
  volume?: string;
  high?: number;
  low?: number;
  apiProvider?: APIProvider;
  apiStatus?: APIStatus;
}

export function StockDataCard({
  symbol = "AAPL",
  currentPrice = 175.43,
  priceChange = 2.15,
  priceChangePercent = 1.24,
  volume = "52.3M",
  high = 176.82,
  low = 173.21,
  apiProvider = "Mock Data",
  apiStatus = "active"
}: StockDataCardProps) {
  const isPositive = priceChange >= 0;

  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Stock Data</CardTitle>
          <APIStatusBadge provider={apiProvider} status={apiStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm text-muted-foreground mb-1">
            <span className="font-mono font-bold text-base">{symbol}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-mono font-bold" data-testid="text-current-price">
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`flex items-center gap-1 text-lg ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-mono" data-testid="text-price-change">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Volume</div>
            <div className="text-base font-mono font-medium" data-testid="text-volume">{volume}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">High</div>
            <div className="text-base font-mono font-medium" data-testid="text-high">${high.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Low</div>
            <div className="text-base font-mono font-medium" data-testid="text-low">${low.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Market</div>
            <div className="text-base font-mono font-medium">Open</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
