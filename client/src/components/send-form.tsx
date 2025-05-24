import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { sendTransactionSchema, type SendTransactionRequest } from "@shared/schema";
import { sendTransaction } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";

interface SendFormProps {
  walletId: number;
  balances: {
    SOL: number;
    USDC: number;
  };
}

export default function SendForm({ walletId, balances }: SendFormProps) {
  const [selectedToken, setSelectedToken] = useState<"SOL" | "USDC">("SOL");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SendTransactionRequest>({
    resolver: zodResolver(sendTransactionSchema),
    defaultValues: {
      recipientAddress: "",
      amount: "",
      token: "SOL",
    },
  });

  const sendMutation = useMutation({
    mutationFn: (data: SendTransactionRequest) => sendTransaction(walletId, data),
    onSuccess: (data) => {
      toast({
        title: "Transaction Sent",
        description: `Transaction sent successfully! TX ID: ${data.transaction.txHash}`,
      });
      form.reset();
      // Invalidate wallet data to refresh balances
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", walletId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive",
      });
    },
  });

  const handleSend = (data: SendTransactionRequest) => {
    sendMutation.mutate(data);
  };

  const setMaxAmount = () => {
    const maxBalance = balances[selectedToken];
    const fee = 0.000005; // SOL fee
    const adjustedMax = selectedToken === "SOL" ? Math.max(0, maxBalance - fee) : maxBalance;
    form.setValue("amount", adjustedMax.toString());
  };

  const currentAmount = form.watch("amount");
  const usdValue = currentAmount ? parseFloat(currentAmount) * (selectedToken === "SOL" ? 100 : 1) : 0;
  const availableBalance = balances[selectedToken];

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">Send Crypto</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSend)} className="space-y-6">
            {/* Token Selection */}
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Token</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value: "SOL" | "USDC") => {
                      field.onChange(value);
                      setSelectedToken(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SOL">
                        SOL - Solana ({balances.SOL.toFixed(2)} Available)
                      </SelectItem>
                      <SelectItem value="USDC">
                        USDC - USD Coin ({balances.USDC.toFixed(2)} Available)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recipient Address */}
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="resize-none bg-background border-border"
                      rows={2}
                      placeholder="Enter Solana wallet address..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.000001"
                        className="bg-background border-border pr-16"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={setMaxAmount}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[hsl(var(--solana-purple))] text-sm font-medium"
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-secondary text-sm">
                    ≈ ${usdValue.toFixed(2)} USD • Available: {availableBalance.toFixed(6)} {selectedToken}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Fee */}
            <div className="bg-background rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Fee</span>
                <span className="text-sm">≈ 0.000005 SOL ($0.0005)</span>
              </div>
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              className="w-full gradient-purple hover:opacity-90 text-white font-medium transition-all duration-200"
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Transaction...
                </>
              ) : (
                "Send Transaction"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
