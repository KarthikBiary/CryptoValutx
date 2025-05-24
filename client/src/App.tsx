import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LoginPage from "@/pages/login";
import CreateAccountPage from "@/pages/create-account";
import Dashboard from "@/pages/dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "create" | "dashboard">("login");
  const [walletData, setWalletData] = useState<any>(null);

  const handleLoginSuccess = (data: any) => {
    setWalletData(data);
    setCurrentPage("dashboard");
  };

  const handleCreateAccount = () => {
    setCurrentPage("create");
  };

  const handleBackToLogin = () => {
    setCurrentPage("login");
  };

  const handleAccountCreated = (privateKey: string) => {
    // Auto-fill the private key and go back to login
    setCurrentPage("login");
    // We could pass the private key here to auto-fill the form if needed
  };

  const handleLogout = () => {
    setCurrentPage("login");
    setWalletData(null);
    // Clear any cached data
    queryClient.clear();
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "create":
        return (
          <CreateAccountPage 
            onBackToLogin={handleBackToLogin}
            onAccountCreated={handleAccountCreated}
          />
        );
      case "dashboard":
        return (
          <Dashboard 
            walletData={walletData} 
            onLogout={handleLogout} 
          />
        );
      default:
        return (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess}
            onCreateAccount={handleCreateAccount}
          />
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          {renderCurrentPage()}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
