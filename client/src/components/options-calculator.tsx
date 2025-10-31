import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { OptionsPrice } from "@shared/schema";

interface OptionsCalculatorProps {
  onCalculate?: (params: OptionCalculationParams) => void;
  result?: OptionsPrice;
  isLoading?: boolean;
}

export interface OptionCalculationParams {
  symbol: string;
  stockPrice: number;
  strikePrice: number;
  daysToExpiry: number;
  volatility: number;
  riskFreeRate: number;
}

export function OptionsCalculator({ onCalculate, result, isLoading }: OptionsCalculatorProps) {
  const [params, setParams] = useState<OptionCalculationParams>({
    symbol: "AAPL",
    stockPrice: 150,
    strikePrice: 155,
    daysToExpiry: 30,
    volatility: 0.25,
    riskFreeRate: 0.05,
  });

  const handleCalculate = () => {
    onCalculate?.(params);
  };

  const updateParam = (key: keyof OptionCalculationParams, value: string | number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Black-Scholes Options Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={params.symbol}
              onChange={(e) => updateParam('symbol', e.target.value)}
              placeholder="e.g., AAPL"
              data-testid="input-option-symbol"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockPrice">Current Stock Price ($)</Label>
            <Input
              id="stockPrice"
              type="number"
              step="0.01"
              value={params.stockPrice}
              onChange={(e) => updateParam('stockPrice', parseFloat(e.target.value))}
              data-testid="input-stock-price"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strikePrice">Strike Price ($)</Label>
            <Input
              id="strikePrice"
              type="number"
              step="0.01"
              value={params.strikePrice}
              onChange={(e) => updateParam('strikePrice', parseFloat(e.target.value))}
              data-testid="input-strike-price"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="daysToExpiry">Days to Expiry</Label>
            <Input
              id="daysToExpiry"
              type="number"
              value={params.daysToExpiry}
              onChange={(e) => updateParam('daysToExpiry', parseInt(e.target.value))}
              data-testid="input-days-expiry"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="volatility">Implied Volatility (σ)</Label>
            <Input
              id="volatility"
              type="number"
              step="0.01"
              value={params.volatility}
              onChange={(e) => updateParam('volatility', parseFloat(e.target.value))}
              placeholder="e.g., 0.25 for 25%"
              data-testid="input-volatility"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskFreeRate">Risk-Free Rate</Label>
            <Input
              id="riskFreeRate"
              type="number"
              step="0.01"
              value={params.riskFreeRate}
              onChange={(e) => updateParam('riskFreeRate', parseFloat(e.target.value))}
              placeholder="e.g., 0.05 for 5%"
              data-testid="input-risk-free-rate"
            />
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full" data-testid="button-calculate-options">
          Calculate Option Prices
        </Button>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && result && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-sm text-muted-foreground mb-1">Call Option Price</div>
                <div className="text-3xl font-bold font-mono text-green-600 dark:text-green-400" data-testid="text-call-price">
                  ${result.callPrice.toFixed(2)}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-sm text-muted-foreground mb-1">Put Option Price</div>
                <div className="text-3xl font-bold font-mono text-red-600 dark:text-red-400" data-testid="text-put-price">
                  ${result.putPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-3">The Greeks</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Delta (Δ)</div>
                  <div className="text-lg font-bold font-mono">{result.delta.toFixed(4)}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Gamma (Γ)</div>
                  <div className="text-lg font-bold font-mono">{result.gamma.toFixed(4)}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Theta (Θ)</div>
                  <div className="text-lg font-bold font-mono">{result.theta.toFixed(4)}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Vega (ν)</div>
                  <div className="text-lg font-mono font-bold">{result.vega.toFixed(4)}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">Rho (ρ)</div>
                  <div className="text-lg font-bold font-mono">{result.rho.toFixed(4)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
