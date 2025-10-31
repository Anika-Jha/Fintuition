// Black-Scholes Option Pricing Model

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - probability : probability;
}

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export interface OptionParams {
  stockPrice: number;
  strikePrice: number;
  daysToExpiry: number;
  volatility: number;
  riskFreeRate: number;
}

export function calculateBlackScholes(params: OptionParams) {
  const { stockPrice: S, strikePrice: K, daysToExpiry, volatility: sigma, riskFreeRate: r } = params;
  
  const T = daysToExpiry / 365; // Convert days to years
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  // Call and Put prices
  const callPrice = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  const putPrice = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  
  // Greeks
  const delta = normalCDF(d1);
  const gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
  const theta = -(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normalCDF(d2);
  const vega = S * normalPDF(d1) * Math.sqrt(T) / 100; // Divided by 100 for percentage
  const rho = K * T * Math.exp(-r * T) * normalCDF(d2) / 100; // Divided by 100 for percentage
  
  return {
    callPrice,
    putPrice,
    delta,
    gamma,
    theta: theta / 365, // Daily theta
    vega,
    rho,
  };
}
