import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { OptionsCalculator, type OptionCalculationParams } from "@/components/options-calculator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { OptionsPrice } from "@shared/schema";

export default function OptionsPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<OptionsPrice | undefined>();

  const calculateMutation = useMutation({
    mutationFn: (params: OptionCalculationParams) =>
      apiRequest("POST", "/api/options/calculate", params),
    onSuccess: (data: any) => {
      setResult(data as OptionsPrice);
    },
    onError: () => {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate option prices. Please check your inputs.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Options Pricing</h1>
        <p className="text-muted-foreground">
          Calculate option prices using the Black-Scholes model
        </p>
      </div>

      <OptionsCalculator
        onCalculate={(params) => calculateMutation.mutate(params)}
        result={result}
        isLoading={calculateMutation.isPending}
      />
    </div>
  );
}
