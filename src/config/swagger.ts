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
      { name: 'Authentication', description: 'User registration and session management' },
      { name: 'Chat', description: 'Users, posts, comments, links, and messages' },
      { name: 'Weather', description: 'Daily weather from Open-Meteo' },
      { name: 'System', description: 'System endpoints' }
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
        Post: {
          type: 'object',
          required: ['id', 'author_id', 'title', 'body', 'created_at'],
          properties: {
            id: { type: 'integer', example: 1 },
            author_id: { type: 'integer', example: 1 },
            author_email: { type: 'string', format: 'email', example: 'user@example.com' },
            title: { type: 'string', example: 'My first post' },
            body: { type: 'string', example: 'Hello from the chat API.' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          required: ['id', 'post_id', 'author_id', 'body', 'created_at'],
          properties: {
            id: { type: 'integer', example: 1 },
            post_id: { type: 'integer', example: 1 },
            author_id: { type: 'integer', example: 1 },
            author_email: { type: 'string', format: 'email' },
            body: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Link: {
          type: 'object',
          required: ['id', 'post_id', 'url', 'created_at'],
          properties: {
            id: { type: 'integer', example: 1 },
            post_id: { type: 'integer', example: 1 },
            url: { type: 'string', format: 'uri' },
            link_title: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Message: {
          type: 'object',
          required: ['id', 'sender_id', 'recipient_id', 'body', 'created_at'],
          properties: {
            id: { type: 'integer', format: 'int64', example: 1 },
            sender_id: { type: 'integer', example: 1 },
            recipient_id: { type: 'integer', example: 2 },
            sender_email: { type: 'string', format: 'email' },
            recipient_email: { type: 'string', format: 'email' },
            body: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            read_at: { type: 'string', format: 'date-time', nullable: true }
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
        },
        PostInput: {
          type: 'object',
          required: ['title', 'body'],
          properties: {
            title: { type: 'string', maxLength: 255 },
            body: { type: 'string' }
          }
        },
        CommentInput: {
          type: 'object',
          required: ['body'],
          properties: { body: { type: 'string' } }
        },
        LinkInput: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string', format: 'uri' },
            title: { type: 'string', nullable: true }
          }
        },
        MessageInput: {
          type: 'object',
          required: ['recipientId', 'body'],
          properties: {
            recipientId: { type: 'integer', minimum: 1 },
            body: { type: 'string' }
          }
        },
        IdResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            message: { type: 'string' }
          }
        },
        MessageResponse: {
          type: 'object',
          required: ['message'],
          properties: { message: { type: 'string' } }
        },
        PostDetails: {
          type: 'object',
          required: ['post', 'comments', 'links'],
          properties: {
            post: { $ref: '#/components/schemas/Post' },
            comments: { type: 'array', items: { $ref: '#/components/schemas/Comment' } },
            links: { type: 'array', items: { $ref: '#/components/schemas/Link' } }
          }
        },
        WeatherDay: {
          type: 'object',
          required: ['date', 'latitude', 'longitude', 'timezone'],
          properties: {
            date: { type: 'string', format: 'date' },
            latitude: { type: 'number', example: 52.52 },
            longitude: { type: 'number', example: 13.41 },
            timezone: { type: 'string', example: 'Europe/Berlin' },
            temperatureMax: { type: 'number', nullable: true, description: 'Maximum temperature in Celsius' },
            temperatureMin: { type: 'number', nullable: true, description: 'Minimum temperature in Celsius' },
            precipitation: { type: 'number', nullable: true, description: 'Precipitation in millimeters' },
            windSpeedMax: { type: 'number', nullable: true, description: 'Maximum wind speed in km/h' },
            weatherCode: { type: 'integer', nullable: true, description: 'WMO weather interpretation code' }
          }
        }
      }
    },
    paths: {
      '/health': {
        get: {
          tags: ['System'],
          summary: 'Check whether the API is running',
          responses: { 200: { description: 'API is healthy' } }
        }
      },
      '/api/auth/me': {
        get: {
          tags: ['Authentication'],
          security: [{ bearerAuth: [] }],
          summary: 'Get the logged-in user',
          responses: { 200: { description: 'Current user' }, 401: { description: 'Login required' }, 404: { description: 'User not found' } }
        }
      },
      '/api/weather/{date}': {
        get: {
          tags: ['Weather'],
          summary: 'Get daily weather from Open-Meteo',
          parameters: [
            { name: 'date', in: 'path', required: true, schema: { type: 'string', format: 'date', example: '2026-08-27' } },
            { name: 'latitude', in: 'query', required: true, schema: { type: 'number', minimum: -90, maximum: 90, example: 52.52 } },
            { name: 'longitude', in: 'query', required: true, schema: { type: 'number', minimum: -180, maximum: 180, example: 13.41 } }
          ],
          responses: {
            200: { description: 'Weather returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/WeatherDay' } } } },
            400: { description: 'Invalid date or coordinates', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            502: { description: 'Open-Meteo is unavailable', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
          }
        }
      },
      '/api/users': {
        get: {
          tags: ['Chat'],
          security: [{ bearerAuth: [] }],
          summary: 'List users without password hashes',
          responses: {
            200: { description: 'Users returned', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
            401: { description: 'Login required' }
          }
        }
      },
      '/api/posts': {
        get: {
          tags: ['Chat'],
          security: [{ bearerAuth: [] }],
          summary: 'List posts',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 } },
            { name: 'offset', in: 'query', schema: { type: 'integer', default: 0, minimum: 0 } }
          ],
          responses: {
            200: { description: 'Posts returned', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Post' } } } } },
            400: { description: 'Invalid pagination' }
          }
        },
        post: {
          tags: ['Chat'],
          security: [{ bearerAuth: [] }],
          summary: 'Create a post',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostInput' } } } },
          responses: {
            201: { description: 'Post created', content: { 'application/json': { schema: { $ref: '#/components/schemas/IdResponse' } } } },
            400: { description: 'Invalid post' }
          }
        }
      },
      '/api/posts/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
        get: { tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Get one post with comments and links', responses: { 200: { description: 'Post returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/PostDetails' } } } }, 404: { description: 'Post not found' } } },
        patch: {
          tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Update your post',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/PostInput' } } } },
          responses: { 200: { description: 'Post updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } }, 404: { description: 'Post not found or not owned' } }
        },
        delete: { tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Delete your post', responses: { 200: { description: 'Post deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } }, 404: { description: 'Post not found or not owned' } } }
      },
      '/api/posts/{id}/comments': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
        get: { tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'List post comments', responses: { 200: { description: 'Comments returned', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } } } },
        post: {
          tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Add a comment',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentInput' } } } },
          responses: { 201: { description: 'Comment created', content: { 'application/json': { schema: { $ref: '#/components/schemas/IdResponse' } } } }, 400: { description: 'Invalid comment' } }
        }
      },
      '/api/comments/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
        delete: { tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Delete your comment', responses: { 200: { description: 'Comment deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } }, 404: { description: 'Comment not found or not owned' } } }
      },
      '/api/posts/{id}/links': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
        post: {
          tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Add a link to a post',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LinkInput' } } } },
          responses: { 201: { description: 'Link added', content: { 'application/json': { schema: { $ref: '#/components/schemas/IdResponse' } } } }, 400: { description: 'Invalid URL' } }
        },
        get: { tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'List post links', responses: { 200: { description: 'Links returned', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Link' } } } } } } }
      },
      '/api/messages': {
        post: {
          tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Send a message',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageInput' } } } },
          responses: { 201: { description: 'Message sent', content: { 'application/json': { schema: { $ref: '#/components/schemas/IdResponse' } } } }, 400: { description: 'Invalid message' } }
        }
      },
      '/api/messages/{userId}': {
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
        get: { tags: ['Chat'], security: [{ bearerAuth: [] }], summary: 'Get a conversation with a user', responses: { 200: { description: 'Conversation returned', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Message' } } } } } } }
      }
    }
  },
  apis: [
    './src/routes/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
