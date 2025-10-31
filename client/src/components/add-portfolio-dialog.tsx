import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InsertPortfolio } from "@shared/schema";

interface AddPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (portfolio: InsertPortfolio) => void;
  isPending?: boolean;
}

export function AddPortfolioDialog({
  open,
  onOpenChange,
  onAdd,
  isPending,
}: AddPortfolioDialogProps) {
  const [formData, setFormData] = useState<InsertPortfolio>({
    symbol: "",
    quantity: 0,
    avgPrice: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ symbol: "", quantity: 0, avgPrice: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-add-holding">
        <DialogHeader>
          <DialogTitle>Add Portfolio Holding</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                placeholder="e.g., AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                required
                data-testid="input-symbol"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Number of shares"
                value={formData.quantity || ""}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                required
                data-testid="input-quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avgPrice">Average Purchase Price</Label>
              <Input
                id="avgPrice"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Price per share"
                value={formData.avgPrice || ""}
                onChange={(e) => setFormData({ ...formData, avgPrice: parseFloat(e.target.value) || 0 })}
                required
                data-testid="input-avg-price"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} data-testid="button-submit-holding">
              {isPending ? "Adding..." : "Add Holding"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
