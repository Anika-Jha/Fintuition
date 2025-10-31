import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Alert } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface AlertsListProps {
  alerts?: Alert[];
  isLoading?: boolean;
  onDismiss?: (id: string) => void;
}

export function AlertsList({ alerts = [], isLoading, onDismiss }: AlertsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAlertIcon = (type: string) => {
    if (type === 'buy') return TrendingUp;
    if (type === 'sell') return TrendingDown;
    return AlertCircle;
  };

  const getAlertVariant = (type: string): "default" | "destructive" | "secondary" => {
    if (type === 'buy') return 'default';
    if (type === 'sell') return 'destructive';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI Trade Alerts</CardTitle>
          <Badge variant="outline">{alerts.length} Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No active alerts</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated trade signals will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <div
                  key={alert.id}
                  className="p-4 rounded-lg border border-border bg-card hover-elevate"
                  data-testid={`alert-${alert.symbol}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${alert.type === 'buy' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : alert.type === 'sell' ? 'bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                      <AlertIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{alert.symbol}</span>
                        <Badge variant={getAlertVariant(alert.type)} className="text-xs">
                          {alert.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(alert.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDismiss?.(alert.id)}
                      data-testid={`button-dismiss-${alert.symbol}`}
                      className="h-8 w-8 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
