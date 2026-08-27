import { Router } from 'express';
import {
	createUser,
     loginUser,
    logoutUser,
    getCurrentUser,
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
 *           schema: { $ref: '#/components/schemas/RegisterRequest' }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
routerRegister.post('/register', createUser);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LoginRequest' }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 *       400:
 *         description: Email and password are required
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Invalid credentials or bearer token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Token configuration error or database error
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
routerRegister.post('/login', loginUser);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get the logged-in user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       401: { description: Missing or invalid bearer token }
 *       404: { description: User not found }
 */
routerRegister.get('/me', requireLogin, getCurrentUser);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Token can be removed by the client
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/MessageResponse' }
 *       401:
 *         description: Missing or invalid bearer token
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */
routerRegister.post('/logout',requireLogin, logoutUser);