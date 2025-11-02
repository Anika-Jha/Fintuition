import { APIStatusBadge } from '../api-status-badge';

export default function APIStatusBadgeExample() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        <APIStatusBadge provider="Yahoo Finance" status="active" />
        <APIStatusBadge provider="Alpha Vantage" status="fallback" />
        <APIStatusBadge provider="Finnhub" status="offline" />
        <APIStatusBadge provider="OpenAI" status="active" />
        <APIStatusBadge provider="Mock Data" status="active" />
      </div>
    </div>
  );
}
