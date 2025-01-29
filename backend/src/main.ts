import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from '../data-source';

async function bootstrap() {
  await AppDataSource.initialize()
    .then(() => {
      console.log('✅ Database connection initialized successfully.');
    })
    .catch((err) => {
      console.error('❌ Error during database initialization:', err);
      process.exit(1);
    });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  // Global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 Server is running on: http://localhost:3000`);
}

bootstrap();
