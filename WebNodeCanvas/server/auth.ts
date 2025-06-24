import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Você deve usar um segredo melhor em produção e armazená-lo em variáveis de ambiente
const JWT_SECRET = 'pixcoin-presale-secret-key';
const JWT_EXPIRES_IN = '24h';

// Gerar hash de senha
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verificar senha
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Gerar token JWT
export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    // Não inclua dados sensíveis no payload
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Middleware para verificar autenticação
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication token is required' });
  }
  
  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token format invalid' });
  }
  
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token format invalid' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // @ts-ignore - Adiciona o usuário decodificado à requisição
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Middleware para verificar se o usuário é um administrador
// Isso será usado para proteger as rotas administrativas
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized: Admin access required' });
  }
  
  return next();
}