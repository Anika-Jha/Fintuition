import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { HistoricalData } from "@shared/schema";

interface StockChartProps {
  symbol: string;
  onTimeframeChange?: (period: string) => void;
}

const timeframes = [
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "1Y", value: "1y" },
];

export function StockChart({ symbol, onTimeframeChange }: StockChartProps) {
  const [timeframe, setTimeframe] = useState("1mo");

  const { data, isLoading } = useQuery<HistoricalData[]>({
    queryKey: [`/api/price/${symbol}/historical?period=${timeframe}`],
    enabled: !!symbol,
  });

  const handleTimeframeChange = (period: string) => {
    setTimeframe(period);
    onTimeframeChange?.(period);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  })) ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{symbol} Price Chart</CardTitle>
          <div className="flex gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTimeframeChange(tf.value)}
                data-testid={`button-timeframe-${tf.value}`}
                className="h-8"
              >
                {tf.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--popover-border))',
                  borderRadius: '0.375rem',
                }}
                labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="close"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Close Price"
              />
              <Line
                type="monotone"
                dataKey="high"
                stroke="hsl(var(--chart-2))"
                strokeWidth={1}
                dot={false}
                name="High"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="hsl(var(--chart-4))"
                strokeWidth={1}
                dot={false}
                name="Low"
                strokeDasharray="5 5"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
