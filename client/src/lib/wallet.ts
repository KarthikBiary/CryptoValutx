import { apiRequest } from "./queryClient";
import type { LoginRequest, SendTransactionRequest } from "@shared/schema";

export interface WalletBalance {
  SOL: number;
  USDC: number;
  totalValue: number;
}

export interface WalletData {
  id: number;
  address: string;
  publicKey: string;
  isDemo: boolean;
  balances: WalletBalance;
}

export interface LoginResponse {
  wallet: {
    id: number;
    address: string;
    publicKey: string;
    privateKey: string;
    isDemo: boolean;
    createdAt: string;
  };
  balances: WalletBalance;
  transactions: any[];
}

export async function loginToWallet(loginData: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest("POST", "/api/auth/login", loginData);
  return response.json();
}

export async function sendTransaction(
  walletId: number,
  transactionData: SendTransactionRequest
): Promise<any> {
  const response = await apiRequest("POST", "/api/transactions/send", {
    ...transactionData,
    walletId,
  });
  return response.json();
}

export async function getWalletData(walletId: number): Promise<any> {
  const response = await apiRequest("GET", `/api/wallet/${walletId}`);
  return response.json();
}

export async function getTransactionHistory(walletId: number): Promise<any> {
  const response = await apiRequest("GET", `/api/transactions/${walletId}`);
  return response.json();
}

export async function queryAI(walletId: number | null, message: string): Promise<{ response: string }> {
  const response = await apiRequest("POST", "/api/ai/query", {
    message,
    walletId,
  });
  return response.json();
}

export interface CreateAccountResponse {
  privateKey: string;
  address: string;
  publicKey: string;
  message: string;
}

export async function createAccount(): Promise<CreateAccountResponse> {
  const response = await apiRequest("POST", "/api/auth/create", {});
  return response.json();
}
