import { 
  User, InsertUser, 
  Token, InsertToken, 
  Purchase, InsertPurchase, 
  Message, InsertMessage 
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUserKycStatus(id: number, status: string): Promise<User | undefined>;
  updateUserKycDocuments(id: number, documents: any): Promise<User | undefined>;
  
  // Token operations
  getToken(id: number): Promise<Token | undefined>;
  getTokenBySymbol(symbol: string): Promise<Token | undefined>;
  getTokens(activeOnly?: boolean): Promise<Token[]>;
  createToken(token: InsertToken): Promise<Token>;
  updateToken(id: number, data: Partial<Token>): Promise<Token | undefined>;
  
  // Purchase operations
  getPurchases(userId?: number): Promise<Purchase[]>;
  getPurchase(id: number): Promise<Purchase | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  updatePurchaseStatus(id: number, status: string, transactionHash?: string): Promise<Purchase | undefined>;
  
  // Message operations
  getMessages(): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tokens: Map<number, Token>;
  private purchases: Map<number, Purchase>;
  private messages: Map<number, Message>;
  
  private userId: number;
  private tokenId: number;
  private purchaseId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.tokens = new Map();
    this.purchases = new Map();
    this.messages = new Map();
    
    this.userId = 1;
    this.tokenId = 1;
    this.purchaseId = 1;
    this.messageId = 1;
    
    // Add some initial tokens
    this.initializeTokens();
  }

  private initializeTokens(): void {
    const tokens: InsertToken[] = [
      {
        name: "PixCoin",
        symbol: "PXC",
        description: "A moeda digital brasileira integrada com o sistema Pix",
        price: { amount: 0.01, currency: "BNB" },
        available: 1000000,
        minimum: 100,
        progress: 65,
        tag: { text: "Em Alta", type: "hot" },
        active: true,
      },
      {
        name: "MetaPix",
        symbol: "MPX",
        description: "Token para o ecossistema MetaPix de finanças descentralizadas",
        price: { amount: 0.5, currency: "USDT" },
        available: 500000,
        minimum: 50,
        progress: 42,
        tag: { text: "Novo", type: "new" },
        active: true,
      },
      {
        name: "BrasilToken",
        symbol: "BRT",
        description: "Token nacional focado em pagamentos e transferências instantâneas",
        price: { amount: 0.02, currency: "BNB" },
        available: 250000,
        minimum: 200,
        progress: 87,
        tag: { text: "Limitado", type: "limited" },
        active: true,
      }
    ];

    tokens.forEach(token => this.createToken(token));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      kycDocuments: null,
      createdAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserKycStatus(id: number, status: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      kycStatus: status,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserKycDocuments(id: number, documents: any): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      kycDocuments: documents,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Token operations
  async getToken(id: number): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async getTokenBySymbol(symbol: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find(
      (token) => token.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }

  async getTokens(activeOnly: boolean = true): Promise<Token[]> {
    const allTokens = Array.from(this.tokens.values());
    if (activeOnly) {
      return allTokens.filter(token => token.active);
    }
    return allTokens;
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = this.tokenId++;
    const token: Token = {
      ...insertToken,
      id,
    };
    this.tokens.set(id, token);
    return token;
  }

  async updateToken(id: number, data: Partial<Token>): Promise<Token | undefined> {
    const token = this.tokens.get(id);
    if (!token) return undefined;
    
    const updatedToken = {
      ...token,
      ...data,
    };
    this.tokens.set(id, updatedToken);
    return updatedToken;
  }

  // Purchase operations
  async getPurchases(userId?: number): Promise<Purchase[]> {
    const allPurchases = Array.from(this.purchases.values());
    if (userId) {
      return allPurchases.filter(purchase => purchase.userId === userId);
    }
    return allPurchases;
  }

  async getPurchase(id: number): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const id = this.purchaseId++;
    const now = new Date();
    const purchase: Purchase = {
      ...insertPurchase,
      id,
      createdAt: now,
      transactionHash: null,
    };
    this.purchases.set(id, purchase);
    return purchase;
  }

  async updatePurchaseStatus(id: number, status: string, transactionHash?: string): Promise<Purchase | undefined> {
    const purchase = this.purchases.get(id);
    if (!purchase) return undefined;
    
    const updatedPurchase = {
      ...purchase,
      status,
      ...(transactionHash && { transactionHash }),
    };
    this.purchases.set(id, updatedPurchase);
    return updatedPurchase;
  }

  // Message operations
  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    const message: Message = {
      ...insertMessage,
      id,
      read: false,
      createdAt: now,
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = {
      ...message,
      read: true,
    };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }
}

export const storage = new MemStorage();
