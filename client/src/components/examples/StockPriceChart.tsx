import { StockPriceChart } from '../stock-price-chart';

export default function StockPriceChartExample() {
  return (
    <div className="p-6">
      <StockPriceChart symbol="AAPL" apiProvider="Mock Data" apiStatus="active" />
    </div>
  );
}
