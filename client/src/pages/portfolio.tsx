import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PortfolioTable } from "@/components/portfolio-table";
import { AddPortfolioDialog } from "@/components/add-portfolio-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Portfolio, InsertPortfolio, MarketData } from "@shared/schema";

export default function PortfolioPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: portfolios, isLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolio"],
  });

  // Fetch current prices for all portfolio symbols
  const symbols = portfolios?.map(p => p.symbol) ?? [];
  const { data: marketDataArray } = useQuery<MarketData[]>({
    queryKey: ["/api/portfolio/prices", symbols.join(",")],
    enabled: symbols.length > 0,
  });

  // Convert array to record for easier lookup
  const marketData = marketDataArray?.reduce((acc, data) => {
    acc[data.symbol] = { price: data.price, change: data.change };
    return acc;
  }, {} as Record<string, { price: number; change: number }>) ?? {};

  const addMutation = useMutation({
    mutationFn: (portfolio: InsertPortfolio) =>
      apiRequest("POST", "/api/portfolio", portfolio),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setDialogOpen(false);
      toast({
        title: "Success",
        description: "Portfolio holding added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add portfolio holding",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/portfolio/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      toast({
        title: "Success",
        description: "Portfolio holding removed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove portfolio holding",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your investments and performance
        </p>
      </div>

      <PortfolioTable
        portfolios={portfolios}
        marketData={marketData}
        isLoading={isLoading}
        onDelete={(id) => deleteMutation.mutate(id)}
        onAdd={() => setDialogOpen(true)}
      />

      <AddPortfolioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={(portfolio) => addMutation.mutate(portfolio)}
        isPending={addMutation.isPending}
      />
    </div>
  );
}
