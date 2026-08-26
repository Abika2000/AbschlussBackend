import { Router } from 'express';
import {
	createUser,
     loginUser,
    logoutUser,
    requireLogin
} from '../services/index.ts';

export const routerRegister = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: User created }
 *       400: { description: Invalid input }
 *       409: { description: Email already exists }
 */
routerRegister.post('/register', createUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login and receive a JWT
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
routerRegister.post('/login', loginUser);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Token can be removed by the client }
 */
routerRegister.post('/logout',requireLogin, logoutUser);