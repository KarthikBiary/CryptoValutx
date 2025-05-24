import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Copy, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { createAccount, type CreateAccountResponse } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/crypto-utils";

interface CreateAccountPageProps {
  onBackToLogin: () => void;
  onAccountCreated: (privateKey: string) => void;
}

export default function CreateAccountPage({ onBackToLogin, onAccountCreated }: CreateAccountPageProps) {
  const [accountData, setAccountData] = useState<CreateAccountResponse | null>(null);
  const [isPrivateKeyVisible, setIsPrivateKeyVisible] = useState(false);
  const [hasConfirmedSave, setHasConfirmedSave] = useState(false);
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      setAccountData(data);
      toast({
        title: "Account Created!",
        description: "Your new wallet has been generated. Please save your private key securely.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleCopyPrivateKey = async () => {
    if (!accountData) return;
    
    try {
      await copyToClipboard(accountData.privateKey);
      toast({
        title: "Private Key Copied",
        description: "Private key copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy private key",
        variant: "destructive",
      });
    }
  };

  const handleCopyAddress = async () => {
    if (!accountData) return;
    
    try {
      await copyToClipboard(accountData.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  const handleProceedToLogin = () => {
    if (!accountData) return;
    onAccountCreated(accountData.privateKey);
  };

  if (accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-900/20 to-background p-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-purple rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-green))] bg-clip-text text-transparent">
              Account Created!
            </h1>
            <p className="text-secondary mt-2">Your wallet is ready to use</p>
          </div>

          <Card className="bg-card border-border shadow-2xl">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Success Message */}
                <Alert className="border-green-500/20 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-500/80">
                    <strong className="text-green-500">Success!</strong> Your new Solana wallet has been created.
                  </AlertDescription>
                </Alert>

                {/* Private Key Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Private Key</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPrivateKeyVisible(!isPrivateKeyVisible)}
                      className="p-1 h-auto"
                    >
                      {isPrivateKeyVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="relative">
                    <Textarea
                      value={isPrivateKeyVisible ? accountData.privateKey : "•".repeat(64)}
                      readOnly
                      className="resize-none bg-background border-border font-mono text-sm pr-12"
                      rows={3}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPrivateKey}
                      className="absolute right-2 top-2 p-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    This is your private key. Keep it safe and never share it with anyone.
                  </p>
                </div>

                {/* Wallet Address */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Wallet Address</label>
                  <div className="relative">
                    <Textarea
                      value={accountData.address}
                      readOnly
                      className="resize-none bg-background border-border font-mono text-sm pr-12"
                      rows={2}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="absolute right-2 top-2 p-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    This is your public wallet address for receiving funds.
                  </p>
                </div>

                {/* Confirmation Checkbox */}
                <div className="flex items-start space-x-3 p-4 bg-background rounded-lg">
                  <input
                    type="checkbox"
                    id="confirm-save"
                    checked={hasConfirmedSave}
                    onChange={(e) => setHasConfirmedSave(e.target.checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="confirm-save" className="text-sm text-secondary cursor-pointer">
                    I have securely saved my private key and understand that losing it means losing access to my wallet forever.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleProceedToLogin}
                    disabled={!hasConfirmedSave}
                    className="w-full gradient-purple hover:opacity-90 text-white font-medium transition-all duration-200"
                  >
                    Access My Wallet
                  </Button>
                  
                  <Button
                    onClick={onBackToLogin}
                    variant="ghost"
                    className="w-full text-secondary hover:text-foreground"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>

                {/* Security Warning */}
                <Alert className="border-yellow-500/20 bg-yellow-500/10">
                  <Shield className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-yellow-500/80 text-xs">
                    <strong className="text-yellow-500">Security Reminder:</strong> Never share your private key. 
                    Store it in a secure location. This demo is for educational purposes only.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-900/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-green))] bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-secondary mt-2">Generate a new Solana wallet</p>
        </div>

        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">New Wallet</h2>
                <p className="text-secondary text-sm">
                  Create a new Solana wallet with a secure private key that only you control.
                </p>
              </div>

              {/* Security Info */}
              <Alert className="border-blue-500/20 bg-blue-500/10">
                <Shield className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-500/80 text-sm">
                  <strong className="text-blue-500">What you'll get:</strong>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• A unique private key (keep this safe!)</li>
                    <li>• A public wallet address for receiving funds</li>
                    <li>• Full control over your wallet</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => createMutation.mutate()}
                disabled={createMutation.isPending}
                className="w-full gradient-purple hover:opacity-90 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] animate-pulse-glow"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="shimmer">Creating Wallet...</span>
                  </>
                ) : (
                  "Create New Wallet"
                )}
              </Button>

              <Button
                onClick={onBackToLogin}
                variant="ghost"
                disabled={createMutation.isPending}
                className="w-full text-secondary hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>

              {/* Warning */}
              <Alert className="border-yellow-500/20 bg-yellow-500/10">
                <Shield className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-500/80 text-xs">
                  <strong className="text-yellow-500">Important:</strong> Your private key will be generated locally. 
                  Make sure to save it securely as there's no way to recover it if lost.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}