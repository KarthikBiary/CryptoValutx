import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);

  const handleLoginSuccess = (data: any) => {
    setWalletData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWalletData(null);
    // Clear any cached data
    queryClient.clear();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          {isLoggedIn && walletData ? (
            <Dashboard 
              walletData={walletData} 
              onLogout={handleLogout} 
            />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
