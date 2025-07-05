import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Application is running in ${process.env.NODE_ENV || 'development'} mode`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
