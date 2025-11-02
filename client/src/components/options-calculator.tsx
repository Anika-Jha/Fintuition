import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { calculateBlackScholes, type BlackScholesResult } from "@/lib/black-scholes";

export function OptionsCalculator() {
  const [stockPrice, setStockPrice] = useState("100");
  const [strikePrice, setStrikePrice] = useState("100");
  const [daysToExpiry, setDaysToExpiry] = useState("30");
  const [riskFreeRate, setRiskFreeRate] = useState("5");
  const [volatility, setVolatility] = useState("25");
  const [result, setResult] = useState<BlackScholesResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    const inputs = {
      stockPrice: parseFloat(stockPrice),
      strikePrice: parseFloat(strikePrice),
      timeToExpiry: parseFloat(daysToExpiry) / 365,
      riskFreeRate: parseFloat(riskFreeRate) / 100,
      volatility: parseFloat(volatility) / 100,
    };

    const calculationResult = calculateBlackScholes(inputs);
    
    if (calculationResult === null) {
      setError("Invalid inputs. Please check all values are positive numbers.");
      setResult(null);
    } else {
      setResult(calculationResult);
      setError(null);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Options Pricing Calculator</CardTitle>
            <CardDescription>Black-Scholes model with Greeks</CardDescription>
          </div>
          <Calculator className="w-6 h-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="stock-price" className="text-sm font-medium mb-1 block">
                Current Stock Price ($)
              </Label>
              <Input
                id="stock-price"
                type="number"
                step="0.01"
                value={stockPrice}
                onChange={(e) => setStockPrice(e.target.value)}
                className="font-mono"
                data-testid="input-stock-price"
              />
            </div>
            
            <div>
              <Label htmlFor="strike-price" className="text-sm font-medium mb-1 block">
                Strike Price ($)
              </Label>
              <Input
                id="strike-price"
                type="number"
                step="0.01"
                value={strikePrice}
                onChange={(e) => setStrikePrice(e.target.value)}
                className="font-mono"
                data-testid="input-strike-price"
              />
            </div>
            
            <div>
              <Label htmlFor="days-to-expiry" className="text-sm font-medium mb-1 block">
                Days to Expiration
              </Label>
              <Input
                id="days-to-expiry"
                type="number"
                step="1"
                value={daysToExpiry}
                onChange={(e) => setDaysToExpiry(e.target.value)}
                className="font-mono"
                data-testid="input-days-to-expiry"
              />
            </div>
            
            <div>
              <Label htmlFor="risk-free-rate" className="text-sm font-medium mb-1 block">
                Risk-Free Rate (%)
              </Label>
              <Input
                id="risk-free-rate"
                type="number"
                step="0.01"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(e.target.value)}
                className="font-mono"
                data-testid="input-risk-free-rate"
              />
            </div>
            
            <div>
              <Label htmlFor="volatility" className="text-sm font-medium mb-1 block">
                Volatility (%)
              </Label>
              <Input
                id="volatility"
                type="number"
                step="0.01"
                value={volatility}
                onChange={(e) => setVolatility(e.target.value)}
                className="font-mono"
                data-testid="input-volatility"
              />
            </div>
            
            <Button 
              onClick={handleCalculate} 
              className="w-full"
              size="lg"
              data-testid="button-calculate"
            >
              Calculate Options Price
            </Button>
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {result ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Call Option Price</div>
                    <div className="text-3xl font-bold font-mono text-green-600 dark:text-green-400" data-testid="text-call-price">
                      ${result.callPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Put Option Price</div>
                    <div className="text-3xl font-bold font-mono text-red-600 dark:text-red-400" data-testid="text-put-price">
                      ${result.putPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Greeks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Delta</div>
                      <div className="text-xl font-mono font-semibold" data-testid="text-delta">{result.delta.toFixed(4)}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Gamma</div>
                      <div className="text-xl font-mono font-semibold" data-testid="text-gamma">{result.gamma.toFixed(4)}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Theta</div>
                      <div className="text-xl font-mono font-semibold" data-testid="text-theta">{result.theta.toFixed(4)}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Vega</div>
                      <div className="text-xl font-mono font-semibold" data-testid="text-vega">{result.vega.toFixed(4)}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Calculator className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  Enter values and click Calculate to see options prices and Greeks
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
