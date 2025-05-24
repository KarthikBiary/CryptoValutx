import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(), // Encrypted in real implementation
  isDemo: boolean("is_demo").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id),
  txHash: text("tx_hash").notNull().unique(),
  type: text("type").notNull(), // 'send' | 'receive'
  token: text("token").notNull(), // 'SOL' | 'USDC' | etc
  amount: decimal("amount", { precision: 18, scale: 9 }).notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  status: text("status").notNull().default("confirmed"), // 'pending' | 'confirmed' | 'failed'
  timestamp: timestamp("timestamp").defaultNow(),
  fee: decimal("fee", { precision: 18, scale: 9 }),
});

export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  timestamp: true,
});

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;

// Login schema
export const loginSchema = z.object({
  privateKey: z.string().min(1, "Private key is required"),
  isDemo: z.boolean().optional().default(false),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// Send transaction schema
export const sendTransactionSchema = z.object({
  recipientAddress: z.string().min(1, "Recipient address is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be a positive number"),
  token: z.enum(["SOL", "USDC"]),
});

export type SendTransactionRequest = z.infer<typeof sendTransactionSchema>;

// AI query schema
export const aiQuerySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type AiQueryRequest = z.infer<typeof aiQuerySchema>;

// Create account schema
export const createAccountSchema = z.object({
  confirmPrivateKey: z.string().min(1, "Please confirm your private key"),
});

export type CreateAccountRequest = z.infer<typeof createAccountSchema>;
