import { wallets, transactions, aiConversations, type Wallet, type Transaction, type AiConversation, type InsertWallet, type InsertTransaction, type InsertAiConversation } from "@shared/schema";

export interface IStorage {
  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  
  // Transaction operations
  getTransactionsByWalletId(walletId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionByHash(txHash: string): Promise<Transaction | undefined>;
  
  // AI conversation operations
  createAiConversation(conversation: InsertAiConversation): Promise<AiConversation>;
  getAiConversationsByWalletId(walletId: number): Promise<AiConversation[]>;
}

export class MemStorage implements IStorage {
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private aiConversations: Map<number, AiConversation>;
  private currentWalletId: number;
  private currentTransactionId: number;
  private currentConversationId: number;

  constructor() {
    this.wallets = new Map();
    this.transactions = new Map();
    this.aiConversations = new Map();
    this.currentWalletId = 1;
    this.currentTransactionId = 1;
    this.currentConversationId = 1;
    
    // Initialize demo wallet
    this.initializeDemoData();
  }

  private initializeDemoData() {
    const demoWallet: Wallet = {
      id: 1,
      address: "DEMO7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      publicKey: "DEMO_PUBLIC_KEY",
      privateKey: "DEMO_PRIVATE_KEY_DO_NOT_USE_IN_PRODUCTION",
      isDemo: true,
      createdAt: new Date(),
    };
    
    this.wallets.set(1, demoWallet);
    this.currentWalletId = 2;

    // Demo transactions
    const demoTransactions: Transaction[] = [
      {
        id: 1,
        walletId: 1,
        txHash: "4xH8k9mL2nP5qR7sDemoTx1",
        type: "receive",
        token: "SOL",
        amount: "2.5",
        fromAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        toAddress: demoWallet.address,
        status: "confirmed",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        fee: "0.000005",
      },
      {
        id: 2,
        walletId: 1,
        txHash: "9fQ2mN8kDemoTx2",
        type: "send",
        token: "USDC",
        amount: "100",
        fromAddress: demoWallet.address,
        toAddress: "9fQ2mN8kL7wX3eR5tY6uP2sDemoAddress",
        status: "confirmed",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        fee: "0.000005",
      },
      {
        id: 3,
        walletId: 1,
        txHash: "4mR7kL9sDemoTx3",
        type: "receive",
        token: "USDC",
        amount: "500",
        fromAddress: "4mR7kL9sP3nQ5xT8wV2yDemoAddress",
        toAddress: demoWallet.address,
        status: "confirmed",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        fee: "0.000005",
      },
    ];

    demoTransactions.forEach(tx => {
      this.transactions.set(tx.id, tx);
    });
    this.currentTransactionId = 4;
  }

  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.address === address,
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.currentWalletId++;
    const wallet: Wallet = { 
      ...insertWallet, 
      id,
      createdAt: new Date(),
      isDemo: insertWallet.isDemo ?? false,
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async getTransactionsByWalletId(walletId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.walletId === walletId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      timestamp: new Date(),
      walletId: insertTransaction.walletId ?? null,
      status: insertTransaction.status ?? "confirmed",
      fee: insertTransaction.fee ?? null,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionByHash(txHash: string): Promise<Transaction | undefined> {
    return Array.from(this.transactions.values()).find(
      (tx) => tx.txHash === txHash,
    );
  }

  async createAiConversation(insertConversation: InsertAiConversation): Promise<AiConversation> {
    const id = this.currentConversationId++;
    const conversation: AiConversation = { 
      ...insertConversation, 
      id,
      timestamp: new Date(),
      walletId: insertConversation.walletId ?? null,
    };
    this.aiConversations.set(id, conversation);
    return conversation;
  }

  async getAiConversationsByWalletId(walletId: number): Promise<AiConversation[]> {
    return Array.from(this.aiConversations.values())
      .filter(conv => conv.walletId === walletId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();
