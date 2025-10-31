import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Smile, Frown, Meh } from "lucide-react";
import type { Sentiment } from "@shared/schema";

interface SentimentGaugeProps {
  sentiment?: Sentiment;
  isLoading?: boolean;
}

export function SentimentGauge({ sentiment, isLoading }: SentimentGaugeProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!sentiment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Select a stock to view sentiment analysis
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSentimentIcon = () => {
    if (sentiment.sentiment === 'positive') return Smile;
    if (sentiment.sentiment === 'negative') return Frown;
    return Meh;
  };

  const getSentimentColor = () => {
    if (sentiment.sentiment === 'positive') return 'text-green-600 dark:text-green-400';
    if (sentiment.sentiment === 'negative') return 'text-red-600 dark:text-red-400';
    return 'text-yellow-600 dark:text-yellow-400';
  };

  const SentimentIcon = getSentimentIcon();
  const normalizedScore = ((sentiment.score + 1) / 2) * 100; // Convert -1 to 1 range to 0-100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Market Sentiment - {sentiment.symbol}</CardTitle>
          <Badge variant={sentiment.sentiment === 'positive' ? 'default' : sentiment.sentiment === 'negative' ? 'destructive' : 'secondary'}>
            {sentiment.sentiment.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className={`h-20 w-20 rounded-full bg-muted flex items-center justify-center ${getSentimentColor()}`}>
            <SentimentIcon className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-muted-foreground mb-2">Sentiment Score</div>
            <div className="text-4xl font-bold font-mono" data-testid="text-sentiment-score">
              {sentiment.score.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Range: -1 (Very Negative) to +1 (Very Positive)
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence</span>
            <span className="text-sm font-medium">{(sentiment.confidence * 100).toFixed(0)}%</span>
          </div>
          <Progress value={sentiment.confidence * 100} className="h-2" />
        </div>

        <div>
          <div className="h-3 rounded-full overflow-hidden flex">
            <div className="bg-red-500 dark:bg-red-600" style={{ width: '33.33%' }} />
            <div className="bg-yellow-500 dark:bg-yellow-600" style={{ width: '33.33%' }} />
            <div className="bg-green-500 dark:bg-green-600" style={{ width: '33.33%' }} />
          </div>
          <div className="relative h-6">
            <div
              className="absolute top-0 transform -translate-x-1/2 transition-all"
              style={{ left: `${normalizedScore}%` }}
            >
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Analysis Summary</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {sentiment.summary}
          </p>
        </div>

        {sentiment.newsHeadlines.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-3">Recent News</div>
            <div className="space-y-2">
              {sentiment.newsHeadlines.map((news, index) => (
                <div key={index} className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50">
                  <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${news.sentiment === 'positive' ? 'bg-green-500' : news.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <span className="text-muted-foreground">{news.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
