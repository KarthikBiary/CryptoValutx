import { Button } from "@/components/ui/button";
import { Shield, Wallet, Send, ArrowDown, Clock, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  isDemo: boolean;
}

export default function WalletSidebar({ 
  currentSection, 
  onSectionChange, 
  onLogout, 
  isDemo 
}: WalletSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Wallet },
    { id: "send", label: "Send", icon: Send },
    { id: "receive", label: "Receive", icon: ArrowDown },
    { id: "history", label: "History", icon: Clock },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-30">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg">SolWallet</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full justify-start px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(var(--solana-purple))]/20 text-[hsl(var(--solana-purple))]"
                    : "text-secondary hover:bg-secondary/10 hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Button>
            );
          })}
        </div>

        {/* Account Section */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-muted uppercase tracking-wider">
            Account
          </h3>
          <div className="mt-2 space-y-1">
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start px-3 py-2 text-sm font-medium text-secondary hover:bg-secondary/10 hover:text-foreground transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Demo Mode Indicator */}
      {isDemo && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-solana-green/20 text-[hsl(var(--solana-green))] px-3 py-2 rounded-lg text-center">
            <span className="text-xs font-medium">Demo Mode Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
