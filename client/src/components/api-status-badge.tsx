import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export type APIStatus = "active" | "fallback" | "error" | "offline";
export type APIProvider = "Yahoo Finance" | "Alpha Vantage" | "Finnhub" | "OpenAI" | "Mock Data";

interface APIStatusBadgeProps {
  provider: APIProvider;
  status: APIStatus;
  className?: string;
}

export function APIStatusBadge({ provider, status, className }: APIStatusBadgeProps) {
  const statusConfig = {
    active: {
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      dot: "bg-green-500",
    },
    fallback: {
      icon: AlertCircle,
      className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      dot: "bg-amber-500",
    },
    error: {
      icon: XCircle,
      className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      dot: "bg-red-500",
    },
    offline: {
      icon: XCircle,
      className: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
      dot: "bg-gray-500",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} gap-1.5 px-2 py-0.5`}
      data-testid={`badge-api-status-${provider.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="text-xs font-medium">{provider}</span>
    </Badge>
  );
}
