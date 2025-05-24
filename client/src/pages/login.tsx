import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle, Plus } from "lucide-react";
import { loginSchema, type LoginRequest } from "@shared/schema";
import { loginToWallet } from "@/lib/wallet";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLoginSuccess: (walletData: any) => void;
  onCreateAccount: () => void;
}

export default function LoginPage({ onLoginSuccess, onCreateAccount }: LoginPageProps) {
  const [isDemo, setIsDemo] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      privateKey: "",
      isDemo: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginToWallet,
    onSuccess: (data) => {
      toast({
        title: "Login Successful",
        description: isDemo ? "Welcome to demo mode!" : "Welcome to your wallet!",
      });
      onLoginSuccess(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginRequest) => {
    loginMutation.mutate({ ...data, isDemo });
  };

  const handleDemoLogin = () => {
    setIsDemo(true);
    loginMutation.mutate({ 
      privateKey: "DEMO_PRIVATE_KEY", 
      isDemo: true 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-purple-900/20 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--solana-purple))] to-[hsl(var(--solana-green))] bg-clip-text text-transparent">
            SolWallet
          </h1>
          <p className="text-secondary mt-2">Secure Solana Wallet</p>
        </div>

        {/* Login Form */}
        <Card className="bg-card border-border shadow-2xl">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Access Your Wallet</h2>
              <p className="text-secondary text-sm">
                Enter your private key to securely access your wallet
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Private Key</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="resize-none bg-background border-border focus:ring-[hsl(var(--solana-purple))] focus:border-transparent"
                          rows={3}
                          placeholder="Enter your private key or seed phrase..."
                          disabled={loginMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full gradient-purple hover:opacity-90 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Access Wallet"
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-muted text-sm">or</span>
                </div>

                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full bg-solana-green hover:bg-green-500 text-[hsl(var(--dark-bg))] font-medium transition-all duration-200"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending && isDemo ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Demo...
                    </>
                  ) : (
                    "Try Demo Account"
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-muted text-sm">or</span>
                </div>

                <Button
                  type="button"
                  onClick={onCreateAccount}
                  variant="outline"
                  className="w-full border-border bg-background hover:bg-secondary/10 transition-all duration-200"
                  disabled={loginMutation.isPending}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Account
                </Button>
              </form>
            </Form>

            <Alert className="mt-6 border-yellow-500/20 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-500/80 text-xs">
                <strong className="text-yellow-500">Security Notice:</strong> Never share your private key. 
                This demo stores keys locally only.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
