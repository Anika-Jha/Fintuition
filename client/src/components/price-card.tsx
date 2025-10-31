import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceCardProps {
  symbol: string;
  price?: number;
  change?: number;
  changePercent?: number;
  isLoading?: boolean;
}

export function PriceCard({ symbol, price, change, changePercent, isLoading }: PriceCardProps) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-20" />
      </Card>
    );
  }

  const isPositive = (change ?? 0) >= 0;

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-price-${symbol}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-muted-foreground mb-1">
            {symbol}
          </div>
          <div className="text-3xl font-bold font-mono" data-testid={`text-price-${symbol}`}>
            ${price?.toFixed(2) ?? "0.00"}
          </div>
          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-mono">
              {isPositive ? '+' : ''}{change?.toFixed(2) ?? '0.00'}
            </span>
            <span className="font-mono">
              ({isPositive ? '+' : ''}{changePercent?.toFixed(2) ?? '0.00'}%)
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
