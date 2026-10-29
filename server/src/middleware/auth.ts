// apps/server/src/middleware/auth.ts
//
// FIX: routes/recipes.ts imports { authenticate } from './auth', but this
// file didn't exist in the original tree — the folder structure listed it,
// the route imported it, but it was never written. That import would fail
// at build/runtime. Minimal JWT-based implementation below; swap in your
// real session/JWT verification logic and license lookup.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      orgId?: string;
      role: 'student' | 'teacher' | 'admin';
      license: Request['user'] extends infer U ? (U extends { license: infer L } ? L : never) : never;
    };
    req.user = payload as unknown as Express.Request['user'];
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
