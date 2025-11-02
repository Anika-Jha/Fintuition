import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { APIStatusBadge, type APIProvider, type APIStatus } from "./api-status-badge";
import type { HistoricalPrice } from "@shared/schema";

const timePeriods = ["1D", "1W", "1M", "3M", "1Y"] as const;
type TimePeriod = typeof timePeriods[number];

interface StockPriceChartProps {
  symbol?: string;
  data?: HistoricalPrice[];
  apiProvider?: APIProvider;
  apiStatus?: APIStatus;
  onPeriodChange?: (period: string) => void;
  currentPeriod?: string;
}

export function StockPriceChart({ 
  symbol = "AAPL", 
  data = [],
  apiProvider = "Mock Data",
  apiStatus = "active",
  onPeriodChange,
  currentPeriod = "1M"
}: StockPriceChartProps) {
  const handlePeriodChange = (period: TimePeriod) => {
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Price Chart - {symbol}</CardTitle>
          </div>
          <APIStatusBadge provider={apiProvider} status={apiStatus} />
        </div>
        <div className="flex gap-2 pt-2">
          {timePeriods.map((period) => (
            <Button
              key={period}
              variant={currentPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(period)}
              className="text-xs"
              data-testid={`button-period-${period.toLowerCase()}`}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                className="text-muted-foreground"
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                className="text-muted-foreground"
                domain={['auto', 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
