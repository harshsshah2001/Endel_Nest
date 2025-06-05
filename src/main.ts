import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Load SSL certificates (optional)
  const httpsOptions = {
    key: readFileSync(join(__dirname, '..', 'ssl', 'key.pem')),
    cert: readFileSync(join(__dirname, '..', 'ssl', 'cert.pem')),
  };

  // Create NestExpress app with HTTPS
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  // Serve uploaded files
  const uploadDir = join(process.cwd(), 'src/uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });

  // Serve static HTML/CSS/JS from `html-css-js` folder
  const htmlFolder = join(__dirname, '..', '..', 'Endel_HTML-CSS-JS'); // Go up from dist to root
  app.useStaticAssets(htmlFolder);

  // CORS config
  app.enableCors({
    origin: [
      'http://192.168.3.75:8000',
      'http://127.0.0.1:3000',
      'http://192.168.3.75:3000',
      'http://127.0.0.1:8000',
      'http://localhost:3000',
      'http://localhost:8000',
      'https://192.168.3.75:3001',
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Logging middleware
  app.use((req, res, next) => {
    logger.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req: any, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  // Start server
  const port = 3001;
  const host = '0.0.0.0';
  await app.listen(port, host);
  logger.log(`✅ HTTPS app running at: https://192.168.3.75:${port}`);
  logger.log(`✅ Health check at: https://192.168.3.75:${port}/health`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error(`Failed to start application: ${error.message}`, error.stack);
  process.exit(1);
});
