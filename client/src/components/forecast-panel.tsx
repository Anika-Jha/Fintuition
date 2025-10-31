import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Forecast } from "@shared/schema";

interface ForecastPanelProps {
  forecast?: Forecast;
  isLoading?: boolean;
}

export function ForecastPanel({ forecast, isLoading }: ForecastPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Price Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Select a stock to view AI-powered price predictions
          </div>
        </CardContent>
      </Card>
    );
  }

  const priceChange = forecast.predictedPrice - forecast.currentPrice;
  const priceChangePercent = (priceChange / forecast.currentPrice) * 100;
  const isPositive = priceChange > 0;
  const isNeutral = Math.abs(priceChangePercent) < 1;

  const getTrendIcon = () => {
    if (forecast.trend === 'bullish') return TrendingUp;
    if (forecast.trend === 'bearish') return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Price Forecast - {forecast.symbol}</CardTitle>
          <Badge
            variant={forecast.trend === 'bullish' ? 'default' : forecast.trend === 'bearish' ? 'destructive' : 'secondary'}
            className="gap-1"
          >
            <TrendIcon className="h-3 w-3" />
            {forecast.trend.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Current Price</div>
            <div className="text-2xl font-bold font-mono">
              ${forecast.currentPrice.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Predicted Price ({new Date(forecast.targetDate).toLocaleDateString()})
            </div>
            <div className={`text-2xl font-bold font-mono ${isPositive ? 'text-green-600 dark:text-green-400' : isNeutral ? '' : 'text-red-600 dark:text-red-400'}`}>
              ${forecast.predictedPrice.toFixed(2)}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Expected Change</span>
            <span className={`text-sm font-medium font-mono ${isPositive ? 'text-green-600 dark:text-green-400' : isNeutral ? '' : 'text-red-600 dark:text-red-400'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className="text-sm font-medium">{(forecast.confidence * 100).toFixed(0)}%</span>
          </div>
          <Progress value={forecast.confidence * 100} className="h-2" />
        </div>

        <div>
          <div className="text-sm font-medium mb-2">AI Analysis</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {forecast.reasoning}
          </p>
        </div>

        {forecast.keyFactors.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Key Factors</div>
            <ul className="space-y-2">
              {forecast.keyFactors.map((factor, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
