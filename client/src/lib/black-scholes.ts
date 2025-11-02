export interface BlackScholesInputs {
  stockPrice: number;
  strikePrice: number;
  timeToExpiry: number;
  riskFreeRate: number;
  volatility: number;
}

export interface BlackScholesResult {
  callPrice: number;
  putPrice: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

export function calculateBlackScholes(inputs: BlackScholesInputs): BlackScholesResult | null {
  try {
    const { stockPrice, strikePrice, timeToExpiry, riskFreeRate, volatility } = inputs;

    if (
      stockPrice <= 0 ||
      strikePrice <= 0 ||
      timeToExpiry <= 0 ||
      volatility <= 0 ||
      !isFinite(stockPrice) ||
      !isFinite(strikePrice) ||
      !isFinite(timeToExpiry) ||
      !isFinite(riskFreeRate) ||
      !isFinite(volatility)
    ) {
      return null;
    }

    const sqrtT = Math.sqrt(timeToExpiry);
    const d1 = (Math.log(stockPrice / strikePrice) + (riskFreeRate + 0.5 * volatility * volatility) * timeToExpiry) / (volatility * sqrtT);
    const d2 = d1 - volatility * sqrtT;

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const NminusD1 = normalCDF(-d1);
    const NminusD2 = normalCDF(-d2);
    const nd1 = normalPDF(d1);

    const discountFactor = Math.exp(-riskFreeRate * timeToExpiry);
    
    const callPrice = stockPrice * Nd1 - strikePrice * discountFactor * Nd2;
    const putPrice = strikePrice * discountFactor * NminusD2 - stockPrice * NminusD1;

    const delta = Nd1;
    const gamma = nd1 / (stockPrice * volatility * sqrtT);
    const theta = -(stockPrice * nd1 * volatility) / (2 * sqrtT) - riskFreeRate * strikePrice * discountFactor * Nd2;
    const vega = stockPrice * sqrtT * nd1 / 100;

    if (!isFinite(callPrice) || !isFinite(putPrice) || !isFinite(delta) || !isFinite(gamma) || !isFinite(theta) || !isFinite(vega)) {
      return null;
    }

    return {
      callPrice: Math.max(0, callPrice),
      putPrice: Math.max(0, putPrice),
      delta,
      gamma,
      theta: theta / 365,
      vega,
    };
  } catch (error) {
    console.error("Black-Scholes calculation error:", error);
    return null;
  }
}
