import CryptoJS from "crypto-js";

export function generateMockAddress(seed: string): string {
  // Generate a mock Solana address based on seed
  const hash = CryptoJS.SHA256(seed).toString();
  return `SOL${hash.substring(0, 41)}`;
}

export function validateSolanaAddress(address: string): boolean {
  // Basic Solana address validation (simplified)
  return address.length >= 32 && address.length <= 44 && /^[A-Za-z0-9]+$/.test(address);
}

export function formatBalance(balance: number, decimals: number = 6): string {
  return balance.toFixed(decimals);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateTransactionId(): string {
  return `TX${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}
