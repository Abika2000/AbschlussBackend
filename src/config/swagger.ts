import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'Wibilea Abschluss Backend API',
      version: '1.0.0',
      description: ''
      
    },
    servers: [{ url: 'http://localhost:8070' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
    }
  },
  apis: [
    './src/routers/*.ts'
  ]
  
};

export const swaggerSpec = swaggerJSDoc(options);
