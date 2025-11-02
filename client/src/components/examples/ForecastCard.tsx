import { ForecastCard } from '../forecast-card';

export default function ForecastCardExample() {
  return (
    <div className="p-6 max-w-md">
      <ForecastCard 
        prediction={182.50}
        confidence={78}
        timeframe="30 days"
        apiProvider="Mock Data"
        apiStatus="active"
      />
    </div>
  );
}
