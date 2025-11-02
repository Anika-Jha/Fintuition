import { StockDataCard } from '../stock-data-card';

export default function StockDataCardExample() {
  return (
    <div className="p-6 max-w-md">
      <StockDataCard 
        symbol="AAPL"
        currentPrice={175.43}
        priceChange={2.15}
        priceChangePercent={1.24}
        volume="52.3M"
        high={176.82}
        low={173.21}
        apiProvider="Mock Data"
        apiStatus="active"
      />
    </div>
  );
}
