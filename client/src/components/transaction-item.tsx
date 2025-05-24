import { ArrowDown, Send } from "lucide-react";
import { formatCurrency } from "@/lib/crypto-utils";
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  transaction: {
    id: number;
    type: string;
    token: string;
    amount: string;
    fromAddress: string;
    toAddress: string;
    status: string;
    timestamp: string;
    fee?: string;
  };
  walletAddress: string;
}

export default function TransactionItem({ transaction, walletAddress }: TransactionItemProps) {
  const isReceive = transaction.type === "receive";
  const amount = parseFloat(transaction.amount);
  const mockPrice = transaction.token === "SOL" ? 100 : 1; // Mock prices
  const usdValue = amount * mockPrice;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Less than 1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-background rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              isReceive ? "bg-solana-green/20" : "bg-red-500/20"
            )}
          >
            {isReceive ? (
              <ArrowDown className="w-6 h-6 text-[hsl(var(--solana-green))]" />
            ) : (
              <Send className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {isReceive ? "Received" : "Sent"} {transaction.token}
            </p>
            <p className="text-secondary text-sm">
              {isReceive ? "From" : "To"}:{" "}
              {(isReceive ? transaction.fromAddress : transaction.toAddress)
                .slice(0, 4) + "..." + 
                (isReceive ? transaction.fromAddress : transaction.toAddress).slice(-4)}
            </p>
            <p className="text-secondary text-xs">{formatTimestamp(transaction.timestamp)}</p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "font-medium",
              isReceive ? "text-[hsl(var(--solana-green))]" : "text-red-400"
            )}
          >
            {isReceive ? "+" : "-"}{amount.toFixed(transaction.token === "SOL" ? 2 : 2)} {transaction.token}
          </p>
          <p className="text-secondary text-sm">{formatCurrency(usdValue)}</p>
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs",
              getStatusColor(transaction.status)
            )}
          >
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
