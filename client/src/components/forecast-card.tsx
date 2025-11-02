import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";
import { APIStatusBadge, type APIProvider, type APIStatus } from "./api-status-badge";

interface ForecastCardProps {
  prediction?: number;
  confidence?: number;
  timeframe?: string;
  apiProvider?: APIProvider;
  apiStatus?: APIStatus;
}

export function ForecastCard({
  prediction = 182.50,
  confidence = 78,
  timeframe = "30 days",
  apiProvider = "Mock Data",
  apiStatus = "active"
}: ForecastCardProps) {
  const isFallback = apiStatus === "fallback" || apiStatus === "offline";

  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">AI Forecast</CardTitle>
          <APIStatusBadge provider={apiProvider} status={apiStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFallback ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              AI forecasting unavailable. Using historical trend analysis.
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Predicted Price ({timeframe})
              </div>
              <div className="text-2xl font-mono font-bold" data-testid="text-prediction">
                ${prediction.toFixed(2)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Confidence Level
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <span className="text-base font-mono font-medium" data-testid="text-confidence">
                  {confidence}%
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-muted-foreground">
                  Based on technical indicators and market sentiment
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
