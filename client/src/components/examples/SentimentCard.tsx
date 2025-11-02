import { SentimentCard } from '../sentiment-card';

export default function SentimentCardExample() {
  return (
    <div className="p-6 max-w-md">
      <SentimentCard 
        score={72}
        analysis="Market sentiment is bullish based on recent news and social media trends. Positive earnings reports and product launches driving investor confidence."
        apiProvider="Mock Data"
        apiStatus="active"
      />
    </div>
  );
}
