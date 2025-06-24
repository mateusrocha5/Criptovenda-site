import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPurchaseSchema, 
  insertMessageSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { getLatestNews, searchNews, getNewsByCategory } from "./services/newsService";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/tokens", async (req: Request, res: Response) => {
    try {
      const activeOnly = req.query.active === "true";
      const tokens = await storage.getTokens(activeOnly);
      res.json(tokens);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tokens" });
    }
  });

  app.get("/api/tokens/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid token ID" });
      }

      const token = await storage.getToken(id);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      res.json(token);
    } catch (error) {
      res.status(500).json({ message: "Error fetching token" });
    }
  });

  // Admin routes - Get all users
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Update KYC status
  app.put("/api/users/:id/kyc-status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { status } = req.body;
      if (!status || !['pending', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedUser = await storage.updateUserKycStatus(id, status);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error updating KYC status" });
    }
  });

  // Get all purchases
  app.get("/api/purchases", async (req: Request, res: Response) => {
    try {
      const purchases = await storage.getPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching purchases" });
    }
  });

  // Get all messages
  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  // Mark message as read
  app.put("/api/messages/:id/read", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }

      const updatedMessage = await storage.markMessageAsRead(id);
      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Error marking message as read" });
    }
  });

  // Update token
  app.put("/api/tokens/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid token ID" });
      }

      const updatedToken = await storage.updateToken(id, req.body);
      if (!updatedToken) {
        return res.status(404).json({ message: "Token not found" });
      }

      res.json(updatedToken);
    } catch (error) {
      res.status(500).json({ message: "Error updating token" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertMessageSchema.safeParse(req.body);

      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error);
        return res.status(400).json({ message: errorMessage.message });
      }

      const message = await storage.createMessage(validatedData.data);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  });

  // User registration and KYC
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.safeParse(req.body);

      if (!validatedData.success) {
        const errorMessage = fromZodError(validatedData.error);
        return res.status(400).json({ message: errorMessage.message });
      }

      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(validatedData.data.username);
      if (existingUserByUsername) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const existingUserByEmail = await storage.getUserByEmail(validatedData.data.email);
      if (existingUserByEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(validatedData.data);
      // Don't return the password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/users/:id/kyc-documents", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const documents = req.body.documents;
      if (!documents) {
        return res.status(400).json({ message: "No documents provided" });
      }

      const updatedUser = await storage.updateUserKycDocuments(id, documents);
      if (!updatedUser) {
        return res.status(500).json({ message: "Error updating KYC documents" });
      }

      // Set status to "pending" when documents are uploaded
      await storage.updateUserKycStatus(id, "pending");

      res.json({ message: "KYC documents uploaded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error uploading KYC documents" });
    }
  });

  // Purchases
  app.post("/api/purchases", async (req: Request, res: Response) => {
    try {
      const purchaseSchema = insertPurchaseSchema.safeParse(req.body);

      if (!purchaseSchema.success) {
        const errorMessage = fromZodError(purchaseSchema.error);
        return res.status(400).json({ message: errorMessage.message });
      }

      const { userId, tokenId, amount } = purchaseSchema.data;

      // Verify user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify token exists
      const token = await storage.getToken(tokenId);
      if (!token) {
        return res.status(404).json({ message: "Token not found" });
      }

      // Verify sufficient tokens available
      if (token.available < amount) {
        return res.status(400).json({ message: "Insufficient tokens available" });
      }

      // Verify purchase amount meets minimum
      if (amount < token.minimum) {
        return res.status(400).json({ 
          message: `Minimum purchase amount is ${token.minimum} ${token.symbol}` 
        });
      }

      // Create purchase record
      const purchase = await storage.createPurchase(purchaseSchema.data);

      // Update token available count and progress
      const newAvailable = token.available - amount;
      const totalSupply = token.available / (1 - token.progress / 100);
      const newProgress = Math.floor(((totalSupply - newAvailable) / totalSupply) * 100);

      await storage.updateToken(tokenId, { 
        available: newAvailable,
        progress: newProgress
      });

      res.status(201).json(purchase);
    } catch (error) {
      res.status(500).json({ message: "Error processing purchase" });
    }
  });

  app.get("/api/purchases/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const purchases = await storage.getPurchases(userId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Error fetching purchases" });
    }
  });

  // Cryptocurrency news feed routes
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const categories = req.query.categories as string | undefined;
      const excludeCategories = req.query.excludeCategories as string | undefined;
      const lang = (req.query.lang as string) || 'PT';
      const sortOrder = (req.query.sortOrder as 'latest' | 'popular') || 'latest';
      const limit = parseInt(req.query.limit as string) || 10;

      const news = await getLatestNews(categories, excludeCategories, lang, sortOrder, limit);
      res.json(news);
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      res.status(500).json({ message: "Erro ao buscar notícias de criptomoedas" });
    }
  });

  app.get("/api/news/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Parâmetro de pesquisa 'q' é obrigatório" });
      }

      const lang = (req.query.lang as string) || 'PT';
      const limit = parseInt(req.query.limit as string) || 10;

      const results = await searchNews(query, lang, limit);
      res.json(results);
    } catch (error) {
      console.error("Erro ao pesquisar notícias:", error);
      res.status(500).json({ message: "Erro ao pesquisar notícias de criptomoedas" });
    }
  });

  app.get("/api/news/categories", async (req: Request, res: Response) => {
    try {
      const lang = (req.query.lang as string) || 'PT';
      const limit = parseInt(req.query.limit as string) || 5;

      const newsByCategory = await getNewsByCategory(lang, limit);
      res.json(newsByCategory);
    } catch (error) {
      console.error("Erro ao buscar notícias por categoria:", error);
      res.status(500).json({ message: "Erro ao buscar notícias por categoria" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}