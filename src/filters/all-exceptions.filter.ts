import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { ErrorLogger } from "src/common/logger/error.logger";
import { ConfigService } from "@nestjs/config";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly errorLogger: ErrorLogger,
    private readonly config: ConfigService
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';

    const method = request.method;
    const url = request.url;
    const body = request.body || {};
    const userId = request['userId'] || 'anonymous';
    const requestId = request['requestId'] || 'unknown';

    const stack =
      this.config.get('NODE_ENV') === 'production'
        ? 'None available in production'
        : exception.stack || 'No stack trace available';

    const errorLog = {
      requestId,
      timestamp: new Date().toISOString(),
      method,
      url,
      statusCode: status,
      userId,
      duration: undefined,  
      requestBody: body,
      errorMessage: message,
      errorName: exception.response?.error || exception.name || 'UnknownError',
      stack,
    };

    this.errorLogger.error(errorLog); 

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: message,
      error: errorLog.errorName,
    });
  }
}
