import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema - for authentication and KYC
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  cpf: text("cpf").notNull().unique(),
  birthDate: text("birth_date").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  kycStatus: text("kyc_status").notNull().default("pending"), // pending, verified, rejected
  kycDocuments: jsonb("kyc_documents"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tokens schema - for available cryptocurrency tokens
export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull().unique(),
  description: text("description"),
  price: jsonb("price").notNull(), // { amount: number, currency: string }
  available: integer("available").notNull(),
  minimum: integer("minimum").notNull().default(1),
  progress: integer("progress").notNull().default(0),
  tag: jsonb("tag"), // { text: string, type: string }
  active: boolean("active").notNull().default(true),
  imageUrl: text("image_url"),
  contractAddress: text("contract_address"),
  blockchain: text("blockchain").default("BSC"),
});

// Purchases schema - for tracking token purchases
export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenId: integer("token_id").notNull(),
  amount: integer("amount").notNull(),
  price: jsonb("price").notNull(), // { amount, currency }
  paymentMethod: text("payment_method").notNull(), // pix, bnb, usdt
  status: text("status").notNull().default("pending"), // pending, completed, failed
  transactionHash: text("transaction_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages schema - for contact form
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define schemas for inserting data
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, kycDocuments: true });
export const insertTokenSchema = createInsertSchema(tokens).omit({ id: true });
export const insertPurchaseSchema = createInsertSchema(purchases).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, read: true, createdAt: true });

// Define types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertToken = z.infer<typeof insertTokenSchema>;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Define types for select operations
export type User = typeof users.$inferSelect;
export type Token = typeof tokens.$inferSelect;
export type Purchase = typeof purchases.$inferSelect;
export type Message = typeof messages.$inferSelect;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(3, { message: "Nome de usuário deve ter pelo menos 3 caracteres." }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
