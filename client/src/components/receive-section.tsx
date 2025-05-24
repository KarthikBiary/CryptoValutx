import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, AlertTriangle } from "lucide-react";
import { shortenAddress, copyToClipboard } from "@/lib/crypto-utils";
import { useToast } from "@/hooks/use-toast";

interface ReceiveSectionProps {
  walletAddress: string;
}

export default function ReceiveSection({ walletAddress }: ReceiveSectionProps) {
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      setIsCopying(true);
      await copyToClipboard(walletAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  // Generate QR code placeholder (you could integrate a real QR library here)
  const generateQRPlaceholder = () => {
    return (
      <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center">
        <div className="w-40 h-40 bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-xs">QR Code</div>
            <div className="text-xs opacity-60">Scan to Pay</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Receive Crypto</h2>

        <div className="text-center space-y-6">
          {/* QR Code */}
          {generateQRPlaceholder()}

          {/* Wallet Address */}
          <div>
            <p className="text-sm text-secondary mb-2">Your Solana Address</p>
            <div className="bg-background border border-border rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm font-mono break-all flex-1 mr-2">
                {walletAddress}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyAddress}
                disabled={isCopying}
                className="ml-2 p-2 hover:bg-secondary/10 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-secondary mt-1">
              Shortened: {shortenAddress(walletAddress, 6)}
            </p>
          </div>

          {/* Copy Button */}
          <Button
            onClick={handleCopyAddress}
            disabled={isCopying}
            className="w-full bg-solana-green hover:bg-green-500 text-[hsl(var(--dark-bg))] font-medium"
          >
            {isCopying ? "Copying..." : "Copy Address"}
          </Button>

          {/* Warning */}
          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-500/80 text-sm">
              <strong className="text-yellow-500">Important:</strong> Only send Solana (SPL) tokens to this address. 
              Sending other cryptocurrencies may result in permanent loss.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
