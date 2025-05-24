import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, sendTransactionSchema, aiQuerySchema, createAccountSchema } from "@shared/schema";
import { getAIResponse } from "./ai-service";
import CryptoJS from "crypto-js";

// Helper function to generate Solana-like address from private key
function generateAddress(privateKey: string): string {
  const hash = CryptoJS.SHA256(privateKey).toString();
  return `SOL${hash.substring(0, 41)}`;
}

// Helper function to generate a random private key
function generatePrivateKey(): string {
  return CryptoJS.SHA256(Math.random().toString() + Date.now().toString()).toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create account endpoint
  app.post("/api/auth/create", async (req, res) => {
    try {
      // Generate new wallet credentials
      const privateKey = generatePrivateKey();
      const address = generateAddress(privateKey);
      const publicKey = `PUB${privateKey.slice(-10)}`;
      
      const response = {
        privateKey,
        address,
        publicKey,
        message: "New wallet created successfully! Please save your private key securely."
      };
      
      console.log("Create account response:", response);
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    } catch (error) {
      console.error("Create account error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { privateKey, isDemo } = loginSchema.parse(req.body);
      
      if (isDemo) {
        // Return demo wallet
        const demoWallet = await storage.getWallet(1);
        if (!demoWallet) {
          return res.status(404).json({ message: "Demo wallet not found" });
        }
        
        const transactions = await storage.getTransactionsByWalletId(1);
        
        // Calculate balances from transactions
        let solBalance = 25.75; // Demo starting balance
        let usdcBalance = 1000.00; // Demo starting balance
        
        res.json({
          wallet: demoWallet,
          balances: {
            SOL: solBalance,
            USDC: usdcBalance,
            totalValue: (solBalance * 100) + usdcBalance // Mock SOL price at $100
          },
          transactions: transactions.slice(0, 5) // Recent transactions
        });
      } else {
        // For real wallets, generate address based on private key
        const address = generateAddress(privateKey);
        
        let wallet = await storage.getWalletByAddress(address);
        
        if (!wallet) {
          // Create new wallet
          wallet = await storage.createWallet({
            address: address,
            publicKey: `PUB${privateKey.slice(-10)}`,
            privateKey: privateKey,
            isDemo: false,
          });
        }
        
        const transactions = await storage.getTransactionsByWalletId(wallet.id);
        
        // Mock balances for real wallets
        const solBalance = 12.45;
        const usdcBalance = 500.00;
        
        res.json({
          wallet,
          balances: {
            SOL: solBalance,
            USDC: usdcBalance,
            totalValue: (solBalance * 100) + usdcBalance
          },
          transactions: transactions.slice(0, 5)
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid login credentials" });
    }
  });

  // Get wallet details
  app.get("/api/wallet/:id", async (req, res) => {
    try {
      const walletId = parseInt(req.params.id);
      const wallet = await storage.getWallet(walletId);
      
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      const transactions = await storage.getTransactionsByWalletId(walletId);
      
      // Calculate balances from transactions or use mock data
      let solBalance = wallet.isDemo ? 25.75 : 12.45;
      let usdcBalance = wallet.isDemo ? 1000.00 : 500.00;
      
      res.json({
        wallet,
        balances: {
          SOL: solBalance,
          USDC: usdcBalance,
          totalValue: (solBalance * 100) + usdcBalance
        },
        transactions
      });
    } catch (error) {
      console.error("Get wallet error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Send transaction
  app.post("/api/transactions/send", async (req, res) => {
    try {
      const { recipientAddress, amount, token } = sendTransactionSchema.parse(req.body);
      const walletId = req.body.walletId;
      
      if (!walletId) {
        return res.status(400).json({ message: "Wallet ID is required" });
      }
      
      const wallet = await storage.getWallet(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      // Generate mock transaction hash
      const txHash = `TX${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        walletId,
        txHash,
        type: "send",
        token,
        amount,
        fromAddress: wallet.address,
        toAddress: recipientAddress,
        status: "confirmed",
        fee: "0.000005",
      });
      
      res.json({
        transaction,
        message: "Transaction sent successfully"
      });
    } catch (error) {
      console.error("Send transaction error:", error);
      res.status(400).json({ message: "Failed to send transaction" });
    }
  });

  // Get transaction history
  app.get("/api/transactions/:walletId", async (req, res) => {
    try {
      const walletId = parseInt(req.params.walletId);
      const transactions = await storage.getTransactionsByWalletId(walletId);
      
      res.json({ transactions });
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Assistant endpoint
  app.post("/api/ai/query", async (req, res) => {
    try {
      const { message } = aiQuerySchema.parse(req.body);
      const walletId = req.body.walletId;
      
      const response = await getAIResponse(message);
      
      if (walletId) {
        // Store conversation
        await storage.createAiConversation({
          walletId,
          message,
          response,
        });
      }
      
      res.json({ response });
    } catch (error) {
      console.error("AI query error:", error);
      res.status(500).json({ message: "AI service unavailable" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
