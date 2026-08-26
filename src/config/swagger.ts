import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Wibilea Abschluss Backend API',
      version: '1.0.0',
      description: 'API for authentication and the Wibilea backend.'
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
      { name: 'Authentication', description: 'User registration and session management' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 8, format: 'password', example: 'correct-horse-battery-staple' }
          }
        },
        LoginRequest: {
          allOf: [{ $ref: '#/components/schemas/RegisterRequest' }]
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Login successful.' },
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
            userId: { type: 'string', example: '1' }
          }
        },
        Error: {
          type: 'object',
          required: ['error'],
          properties: {
            error: { type: 'string', example: 'Invalid email or password.' }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
