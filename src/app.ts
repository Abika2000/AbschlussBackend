import express, { type Express } from 'express';
import { loadEnvFile } from 'node:process';
import { apiRateLimiter, authRateLimiter } from './middleware/rate-limit.middleware.ts';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.ts';
import { routerRegister } from './routes/register.ts';
import { chatRouter } from './routes/chat.ts';
import { weatherRouter } from './routes/weather.ts';

const app: Express = express();
app.use(express.json());
try {
  loadEnvFile();
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw error;
  }
}
app.use(apiRateLimiter);

//#region API Declarations

app.use('/api/auth', authRateLimiter, routerRegister);
app.use('/api', chatRouter);
app.use('/api', weatherRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {}, {
  persistAuthorization: true
}));
app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec));
//#endregion


const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log("------------------------------------------------------------------------------------");
  console.log(`Server is running on http://localhost:${port}`);

});
