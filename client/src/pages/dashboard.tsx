import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowDown, Clock, Lightbulb } from "lucide-react";
import WalletSidebar from "@/components/wallet-sidebar";
import BalanceCards from "@/components/balance-cards";
import TransactionItem from "@/components/transaction-item";
import SendForm from "@/components/send-form";
import ReceiveSection from "@/components/receive-section";
import TransactionHistory from "@/components/transaction-history";
import AIAssistant from "@/components/ai-assistant";
import { getWalletData } from "@/lib/wallet";

interface DashboardProps {
  walletData: {
    wallet: {
      id: number;
      address: string;
      publicKey: string;
      isDemo: boolean;
    };
    balances: {
      SOL: number;
      USDC: number;
      totalValue: number;
    };
    transactions: any[];
  };
  onLogout: () => void;
}

export default function Dashboard({ walletData: initialData, onLogout }: DashboardProps) {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Fetch updated wallet data
  const { data: walletData } = useQuery({
    queryKey: ["/api/wallet", initialData.wallet.id],
    queryFn: () => getWalletData(initialData.wallet.id),
    initialData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const quickActions = [
    {
      id: "send",
      label: "Send",
      icon: Send,
      color: "text-[hsl(var(--solana-purple))]",
      description: "Send crypto to another wallet",
    },
    {
      id: "receive",
      label: "Receive",
      icon: ArrowDown,
      color: "text-[hsl(var(--solana-green))]",
      description: "Get your wallet address",
    },
    {
      id: "history",
      label: "History",
      icon: Clock,
      color: "text-blue-400",
      description: "View transaction history",
    },
    {
      id: "ai",
      label: "AI Help",
      icon: Lightbulb,
      color: "text-purple-400",
      description: "Get help from AI assistant",
    },
  ];

  const handleQuickAction = (actionId: string) => {
    if (actionId === "ai") {
      setIsAIOpen(true);
    } else {
      setCurrentSection(actionId);
    }
  };

  const getSectionTitle = () => {
    switch (currentSection) {
      case "send":
        return "Send Crypto";
      case "receive":
        return "Receive Crypto";
      case "history":
        return "Transaction History";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WalletSidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={onLogout}
        isDemo={walletData.wallet.isDemo}
      />

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">{getSectionTitle()}</h1>
              {walletData.wallet.isDemo && (
                <Badge className="bg-solana-green/20 text-[hsl(var(--solana-green))] border-0">
                  Demo Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-background px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-solana-green rounded-full"></div>
                <span className="text-sm text-secondary">Mainnet</span>
              </div>
              <Button
                onClick={() => setIsAIOpen(true)}
                className="bg-solana-purple hover:bg-purple-600 text-white font-medium"
              >
                AI Assistant
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {currentSection === "dashboard" && (
            <div className="space-y-6">
              {/* Balance Cards */}
              <BalanceCards balances={walletData.balances} />

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={action.id}
                          variant="ghost"
                          onClick={() => handleQuickAction(action.id)}
                          className="flex flex-col items-center p-4 h-auto bg-background hover:bg-secondary/10 transition-colors"
                        >
                          <Icon className={`w-8 h-8 mb-2 ${action.color}`} />
                          <span className="text-sm font-medium">{action.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentSection("history")}
                      className="text-[hsl(var(--solana-purple))] hover:text-purple-400 text-sm font-medium"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {walletData.transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-secondary">No transactions yet</p>
                        <p className="text-sm text-muted mt-1">
                          Your transaction history will appear here
                        </p>
                      </div>
                    ) : (
                      walletData.transactions.slice(0, 3).map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          walletAddress={walletData.wallet.address}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentSection === "send" && (
            <SendForm
              walletId={walletData.wallet.id}
              balances={walletData.balances}
            />
          )}

          {currentSection === "receive" && (
            <ReceiveSection walletAddress={walletData.wallet.address} />
          )}

          {currentSection === "history" && (
            <TransactionHistory
              walletId={walletData.wallet.id}
              walletAddress={walletData.wallet.address}
            />
          )}
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        walletId={walletData.wallet.id}
      />
    </div>
  );
}
