import { useState } from "react";
import { TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";

interface DashboardHeaderProps {
  onSymbolChange?: (symbol: string) => void;
  currentSymbol?: string;
}

export function DashboardHeader({ onSymbolChange, currentSymbol = "AAPL" }: DashboardHeaderProps) {
  const [searchValue, setSearchValue] = useState(currentSymbol);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim() && onSymbolChange) {
      onSymbolChange(searchValue.trim().toUpperCase());
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold">Fintuition</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ticker..."
              className="pl-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              data-testid="input-search-ticker"
            />
          </form>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
