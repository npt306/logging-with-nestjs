import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { HttpLogger } from './common/logger/http.logger';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { ErrorLogger } from './common/logger/error.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpLogger = new HttpLogger();
  const errorLogger = new ErrorLogger();
  const configService = app.get(ConfigService);

  app.useGlobalInterceptors(new LoggingInterceptor(httpLogger, errorLogger));
  app.useGlobalFilters(new AllExceptionsFilter(errorLogger, configService));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
