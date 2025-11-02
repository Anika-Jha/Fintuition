import { useQuery } from "@tanstack/react-query";
import type { StockData, HistoricalData, Forecast, Sentiment } from "@shared/schema";

interface APIResponse<T> {
  data: T;
  provider: string;
  status: string;
}

interface DashboardResponse {
  stock: APIResponse<StockData>;
  chart: APIResponse<HistoricalData>;
  forecast: APIResponse<Forecast>;
  sentiment: APIResponse<Sentiment>;
}

export function useStockData(symbol: string) {
  return useQuery({
    queryKey: ['/api/stock', symbol],
    enabled: !!symbol,
  });
}

export function useChartData(symbol: string, period: string = "1M") {
  return useQuery({
    queryKey: ['/api/chart', symbol, period],
    queryFn: async () => {
      const response = await fetch(`/api/chart/${symbol}?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch chart data');
      return response.json() as Promise<APIResponse<HistoricalData>>;
    },
    enabled: !!symbol,
  });
}

export function useForecast(symbol: string) {
  return useQuery({
    queryKey: ['/api/forecast', symbol],
    enabled: !!symbol,
  });
}

export function useSentiment(symbol: string) {
  return useQuery({
    queryKey: ['/api/sentiment', symbol],
    enabled: !!symbol,
  });
}

export function useDashboardData(symbol: string, period: string = "1M") {
  return useQuery<DashboardResponse>({
    queryKey: ['/api/dashboard', symbol, period],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/${symbol}?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}
