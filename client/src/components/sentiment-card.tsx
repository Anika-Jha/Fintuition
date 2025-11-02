import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmilePlus, Meh, Frown, AlertCircle } from "lucide-react";
import { APIStatusBadge, type APIProvider, type APIStatus } from "./api-status-badge";

interface SentimentCardProps {
  score?: number;
  analysis?: string;
  apiProvider?: APIProvider;
  apiStatus?: APIStatus;
}

export function SentimentCard({
  score = 72,
  analysis = "Market sentiment is bullish based on recent news and social media trends. Positive earnings reports and product launches driving investor confidence.",
  apiProvider = "Mock Data",
  apiStatus = "active"
}: SentimentCardProps) {
  const isFallback = apiStatus === "fallback" || apiStatus === "offline";
  
  const getSentimentConfig = (score: number) => {
    if (score >= 70) return {
      icon: SmilePlus,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500",
      label: "Bullish"
    };
    if (score >= 40) return {
      icon: Meh,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500",
      label: "Neutral"
    };
    return {
      icon: Frown,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500",
      label: "Bearish"
    };
  };

  const config = getSentimentConfig(score);
  const SentimentIcon = config.icon;

  return (
    <Card className="min-h-[280px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Sentiment Analysis</CardTitle>
          <APIStatusBadge provider={apiProvider} status={apiStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isFallback ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              AI sentiment analysis unavailable. Using basic market indicators.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
                    className={config.color}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <SentimentIcon className={`w-8 h-8 ${config.color}`} />
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Sentiment Score</div>
                <div className="text-2xl font-mono font-bold" data-testid="text-sentiment-score">
                  {score}/100
                </div>
                <div className={`text-sm font-medium ${config.color}`}>
                  {config.label}
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">Analysis</div>
              <p className="text-sm leading-relaxed" data-testid="text-sentiment-analysis">
                {analysis}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
