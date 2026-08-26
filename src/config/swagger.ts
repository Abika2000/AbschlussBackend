import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Wibile Backend API',
      version: '1.0.0',
      description: 'Weapon, ammunition, authentication, and cached advanced weapon statistics API.'
      
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Weapon: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            weapon_name: { type: 'string' },
            category: { type: 'string' },
            caliber: { type: 'string' },
            range_m: { type: 'integer' },
            material: { type: 'string' },
            fire_rate: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Ammunition: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            ammunition_type: { type: 'string' },
            caliber: { type: 'string' },
            penetration_mm: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: { error: { type: 'string' } }
        }
      }
    }
  },
  apis: [
    './src/routers/*.ts'
  ]
  
};

export const swaggerSpec = swaggerJSDoc(options);
