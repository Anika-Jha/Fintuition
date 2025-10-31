import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Portfolio } from "@shared/schema";

interface PortfolioTableProps {
  portfolios?: Portfolio[];
  marketData?: Record<string, { price: number; change: number }>;
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export function PortfolioTable({
  portfolios = [],
  marketData = {},
  isLoading,
  onDelete,
  onAdd,
}: PortfolioTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const calculateTotalValue = () => {
    return portfolios.reduce((total, holding) => {
      const currentPrice = marketData[holding.symbol]?.price ?? holding.avgPrice;
      return total + (holding.quantity * currentPrice);
    }, 0);
  };

  const calculateTotalGain = () => {
    return portfolios.reduce((total, holding) => {
      const currentPrice = marketData[holding.symbol]?.price ?? holding.avgPrice;
      const costBasis = holding.quantity * holding.avgPrice;
      const currentValue = holding.quantity * currentPrice;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const totalValue = calculateTotalValue();
  const totalGain = calculateTotalGain();
  const totalGainPercent = portfolios.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0) > 0
    ? (totalGain / portfolios.reduce((sum, h) => sum + h.avgPrice * h.quantity, 0)) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <div className="flex gap-6 mt-2">
              <div>
                <div className="text-xs text-muted-foreground">Total Value</div>
                <div className="text-xl font-bold font-mono" data-testid="text-portfolio-value">
                  ${totalValue.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Gain</div>
                <div className={`text-xl font-bold font-mono ${totalGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {totalGain >= 0 ? '+' : ''}{totalGain.toFixed(2)} ({totalGainPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
          <Button onClick={onAdd} data-testid="button-add-holding">
            <Plus className="h-4 w-4 mr-2" />
            Add Holding
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No holdings yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your portfolio by adding your first holding
            </p>
            <Button onClick={onAdd} data-testid="button-add-first-holding">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Holding
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolios.map((holding) => {
                const currentPrice = marketData[holding.symbol]?.price ?? holding.avgPrice;
                const costBasis = holding.quantity * holding.avgPrice;
                const currentValue = holding.quantity * currentPrice;
                const gainLoss = currentValue - costBasis;
                const gainLossPercent = (gainLoss / costBasis) * 100;
                const isPositive = gainLoss >= 0;

                return (
                  <TableRow key={holding.id} data-testid={`row-holding-${holding.symbol}`}>
                    <TableCell className="font-medium">{holding.symbol}</TableCell>
                    <TableCell className="text-right font-mono">{holding.quantity}</TableCell>
                    <TableCell className="text-right font-mono">${holding.avgPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono">${currentPrice.toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-mono ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isPositive ? '+' : ''}{gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${currentValue.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(holding.id)}
                        data-testid={`button-delete-${holding.symbol}`}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
