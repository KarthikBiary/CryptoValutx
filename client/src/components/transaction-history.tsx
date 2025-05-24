import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionItem from "./transaction-item";
import { getTransactionHistory } from "@/lib/wallet";

interface TransactionHistoryProps {
  walletId: number;
  walletAddress: string;
}

export default function TransactionHistory({ walletId, walletAddress }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/transactions", walletId],
    queryFn: () => getTransactionHistory(walletId),
  });

  const transactions = data?.transactions || [];

  const filteredTransactions = transactions.filter((tx: any) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Failed to load transaction history
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40 bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="send">Sent</SelectItem>
                <SelectItem value="receive">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-background rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary">No transactions found</p>
              <p className="text-sm text-muted mt-1">
                {filter === "all" 
                  ? "Your transaction history will appear here"
                  : `No ${filter} transactions found`
                }
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction: any) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                walletAddress={walletAddress}
              />
            ))
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-[hsl(var(--solana-purple))] hover:text-purple-400 text-sm font-medium"
            >
              Load More Transactions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
