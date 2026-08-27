import { type Request, type Response } from 'express';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { findUserByEmail, findUserById, insertUser } from './database.service.ts';

const authInput = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function requireLogin(req: Request, res: Response, next: () => void): void {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';

  if (!token || !process.env.TOKEN) {
    res.status(401).json({ error: 'A valid bearer token is required.' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN);
    if (typeof payload !== 'object' || payload === null || typeof payload.userId !== 'string') {
      res.status(401).json({ error: 'The bearer token is invalid.' });
      return;
    }

    req.userId = Number(payload.userId);
    if (!Number.isInteger(req.userId) || req.userId < 1) {
      res.status(401).json({ error: 'The bearer token is invalid.' });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: 'The bearer token is invalid or expired.' });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const result = authInput.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'A valid email and a password of at least 8 characters are required.' });
    return;
  }

  try {
    const normalizedEmail = result.data.email.trim().toLowerCase();
    const passwordHash = await hash(result.data.password, 12);

    const id = await insertUser(normalizedEmail, passwordHash);
    res.status(201).json({ id, email: normalizedEmail });
  } catch (error) {
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'A user with this email already exists.' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Could not create user.' });
  }
}

export function loginUser(req: Request, res: Response): void {
  const result = authInput.safeParse(req.body);
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';

  if (!process.env.TOKEN) {
    res.status(500).json({ error: 'Token secret is not defined in the environment variables.' });
    return;
  }

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.TOKEN);
      res.json({
        message: 'Already logged in.',
        token,
        userId: typeof payload === 'object' && payload !== null ? payload.userId : undefined
      });
      return;
    } catch {
      res.status(401).json({ error: 'The bearer token is invalid or expired.' });
      return;
    }
  }

  if (!result.success) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  findUserByEmail(result.data.email.trim().toLowerCase()).then(async user => {
    if (!user || !(await compare(result.data.password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const userToken = createToken(String(user.id));
    res.json({ message: 'Login successful.', token: userToken, user: { id: user.id, email: user.email } });
  }).catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  });
}

export function logoutUser(_req: Request, res: Response): void {
  res.json({ message: 'Logout successful. Remove the bearer token on the client.' });
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: 'You must be logged in.' });
    return;
  }

  try {
    const user = await findUserById(req.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load the user.' });
  }
}

export function createToken(userId: string): string {
  if (!process.env.TOKEN) {
    throw new Error('Token secret is not defined in the environment variables.');
  }

  return jwt.sign({ userId }, process.env.TOKEN);
}