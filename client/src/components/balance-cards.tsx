import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/crypto-utils";

interface BalanceCardsProps {
  balances: {
    SOL: number;
    USDC: number;
    totalValue: number;
  };
}

export default function BalanceCards({ balances }: BalanceCardsProps) {
  const solPrice = 100; // Mock SOL price
  const solValueUSD = balances.SOL * solPrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* SOL Balance */}
      <Card className="gradient-purple text-white border-0 balance-card hover-lift cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center animate-pulse-glow">
                <span className="text-sm font-bold">SOL</span>
              </div>
              <span className="font-medium">Solana</span>
            </div>
            <TrendingUp className="w-5 h-5 animate-bounce-slow" />
          </div>
          <div>
            <p className="text-2xl font-bold transition-all duration-300 hover:scale-105">{balances.SOL.toFixed(2)}</p>
            <p className="text-white/70 text-sm">≈ {formatCurrency(solValueUSD)}</p>
          </div>
        </CardContent>
      </Card>

      {/* USDC Balance */}
      <Card className="bg-card border-border balance-card hover-lift cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:rotate-12 transition-transform duration-300">
                <span className="text-xs font-bold text-white">USDC</span>
              </div>
              <span className="font-medium">USD Coin</span>
            </div>
            <TrendingUp className="w-5 h-5 text-green-400 animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-bold transition-all duration-300 hover:scale-105">{balances.USDC.toFixed(2)}</p>
            <p className="text-secondary text-sm">≈ {formatCurrency(balances.USDC)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Total Portfolio */}
      <Card className="bg-card border-border balance-card hover-lift cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-solana-green rounded-lg flex items-center justify-center hover:rotate-180 transition-transform duration-500">
                <DollarSign className="w-4 h-4 text-[hsl(var(--dark-bg))]" />
              </div>
              <span className="font-medium">Total Value</span>
            </div>
            <span className="text-[hsl(var(--solana-green))] text-sm animate-pulse">+2.4%</span>
          </div>
          <div>
            <p className="text-2xl font-bold transition-all duration-300 hover:scale-105">{formatCurrency(balances.totalValue)}</p>
            <p className="text-secondary text-sm">Portfolio Value</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
