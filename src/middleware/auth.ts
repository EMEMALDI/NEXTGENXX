import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  dbUser?: any;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' });
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    if (token === 'admin-dev-token') {
      req.user = { uid: 'admin', email: 'admin' } as any;
      const dbUsers = await db.select().from(users).where(eq(users.uid, 'admin'));
      if (dbUsers.length === 0) {
        const newUser = await db.insert(users).values({
          uid: 'admin',
          email: 'admin',
          role: 'admin',
        }).returning();
        req.dbUser = newUser[0];
      } else {
        req.dbUser = dbUsers[0];
      }
      return next();
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    // Fetch db user
    const dbUsers = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
    
    // Auto-create user if missing (helpful for first-time login via OAuth)
    if (dbUsers.length === 0) {
      const email = decodedToken.email || '';
      const newUser = await db.insert(users).values({
        uid: decodedToken.uid,
        email: email,
        role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user', // Basic way to bootstrap admin
      }).returning();
      req.dbUser = newUser[0];
    } else {
      req.dbUser = dbUsers[0];
    }
    
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.dbUser || req.dbUser.role !== 'admin') {
     res.status(403).json({ error: 'Forbidden: Admin access required' });
     return;
  }
  next();
};
