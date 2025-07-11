import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpLogger } from '../logger/http.logger';
import { sanitizeSensitiveFields } from '../utils/sanitize.util';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly httpLogger: HttpLogger,
        private readonly config: ConfigService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req: Request = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();
        const { method, url, body } = req;
        const userId = req['userId'] ?? 'anonymous';
        const requestId = req['requestId'] ?? 'no-id';
        const startTime = Date.now();

        return next.handle().pipe(
            tap((responseData) => {
                const duration = Date.now() - startTime;
                this.httpLogger.info(
                    {
                        requestId,
                        timestamp: new Date().toISOString(),
                        method,
                        url,
                        statusCode: res.statusCode,
                        userId,
                        duration,
                        body: sanitizeSensitiveFields(body),
                        respone: sanitizeSensitiveFields(responseData),
                    },
                );
            }),
            catchError((error) => {
                const duration = Date.now() - startTime;
                const statusCode = error.getStatus?.() ?? 500;
                const stack = this.config.get('NODE_ENV') === 'production'
                    ? 'None available in production'
                    : error.stack || 'No stack trace available';
                this.httpLogger.error(
                    {
                        requestId,
                        timestamp: new Date().toISOString(),
                        method,
                        url,
                        statusCode,
                        userId, 
                        duration,
                        sanitizedBody: sanitizeSensitiveFields(body),
                        errorMessage: error.message || error.toString(),
                        erroName: error.name || 'UnknownError',
                        stack: stack,
                    }
                );

                return throwError(() => error); // giữ nguyên luồng cho ExceptionFilter xử lý
            }),
        );
    }
}
