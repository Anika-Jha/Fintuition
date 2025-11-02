import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { APIStatusBadge, type APIProvider, type APIStatus } from "./api-status-badge";

const timePeriods = ["1D", "1W", "1M", "3M", "1Y"] as const;
type TimePeriod = typeof timePeriods[number];

interface StockPriceChartProps {
  symbol?: string;
  apiProvider?: APIProvider;
  apiStatus?: APIStatus;
}

//todo: remove mock functionality
const generateMockData = (period: TimePeriod) => {
  const basePrice = 100;
  const dataPoints = period === "1D" ? 24 : period === "1W" ? 7 : period === "1M" ? 30 : period === "3M" ? 90 : 252;
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const volatility = 0.02;
    const trend = 0.0001;
    const randomWalk = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + trend * i + randomWalk);
    
    return {
      date: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      price: parseFloat(price.toFixed(2)),
    };
  });
};

export function StockPriceChart({ 
  symbol = "AAPL", 
  apiProvider = "Mock Data",
  apiStatus = "active" 
}: StockPriceChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M");
  const [data] = useState(generateMockData(selectedPeriod));

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    console.log(`Period changed to ${period}`);
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
              variant={selectedPeriod === period ? "default" : "outline"}
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
