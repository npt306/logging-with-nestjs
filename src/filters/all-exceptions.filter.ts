
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { ErrorLogger } from "src/common/logger/error.logger";
import * as util from 'util';
import { ConfigService } from "@nestjs/config";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly errorLogger: ErrorLogger,
        private readonly config: ConfigService
    ) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception instanceof HttpException ? exception.getStatus() : 500;
        const { method, url, body } = request;

        const message = exception.message || 'Internal server error';
        const userId = request['userId'] || 'anonymous';
        const requestId = request['requestId'] || 'unknown';

        let stack = exception.stack || 'No stack trace available';

        if (this.config.get('NODE_ENV') !== 'production') {
            stack = 'None available in production';
        }

        const errorLogString = util.format(
            '[requestId=%s] [%s] %s - %d | Error = %s | Message = %s | userId = %s | Request=%s | Stack = %s',
            requestId,
            method,
            url,
            status,
            exception.response?.error || 'UnknownError',
            message,
            userId,
            body && Object.keys(body).length ? JSON.stringify(body) : '{}',
            stack
        );
        this.errorLogger.error(errorLogString);

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: message,
            error: exception.response.error || 'UnknownError',
        });
    }
}