import { useQuery, useMutation } from "@tanstack/react-query";
import { AlertsList } from "@/components/alerts-list";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Alert } from "@shared/schema";

export default function AlertsPage() {
  const { toast } = useToast();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts"],
  });

  const dismissMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("POST", `/api/alerts/${id}/dismiss`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({
        title: "Alert dismissed",
        description: "The alert has been removed from your list",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Trade Alerts</h1>
        <p className="text-muted-foreground">
          AI-generated trading signals and recommendations
        </p>
      </div>

      <AlertsList
        alerts={alerts}
        isLoading={isLoading}
        onDismiss={(id) => dismissMutation.mutate(id)}
      />
    </div>
  );
}
