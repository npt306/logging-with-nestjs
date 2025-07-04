
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpLogger } from '../logger/http.logger';
import * as util from 'util';
import { sanitizeSensitiveFields } from '../utils/sanitize.util';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly httpLogger: HttpLogger,
    ) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { requestId, method, url, body, userId } = request;
        const startTime = Date.now();

        return next.handle().pipe(
            tap((responseData) => {
                const duration = Date.now() - startTime;
                const { statusCode } = context.switchToHttp().getResponse();
                const sanitizedBody = sanitizeSensitiveFields(body, ['password', 'email', 'token']);
                const sanitizedResponse = sanitizeSensitiveFields(responseData, ['password', 'email', 'token']);
                const logString = util.format(
                    '[requestId=%s] [%s] %s - %d | userId=%s | Duration=%s | Request=%s | Response=%s',
                    requestId,
                    method,
                    url,
                    statusCode,
                    userId ?? 'anonymous',
                    `${duration}ms`,
                    sanitizedBody && Object.keys(sanitizedBody).length ? JSON.stringify(sanitizedBody) : '{}',
                    sanitizedResponse && Object.keys(sanitizedResponse).length ? JSON.stringify(sanitizedResponse) : '{}'
                );
                this.httpLogger.log(logString);
            }),
            // catchError((error) => {
            //     const duration = Date.now() - startTime;
            //     const statusCode = error.getStatus?.() ?? 500;

            //     const errorLogString = util.format(
            //         '[%s] %s - %d | Error = %s | userId = %s | Duration=%s | Request=%s | Stack=%s',
            //         method,
            //         url,
            //         statusCode,
            //         error.message || error.toString(),
            //         userId ?? 'anonymous',
            //         `${duration}ms`,
            //         body && Object.keys(body).length ? JSON.stringify(body) : '{}',
            //         error.stack ? error.stack : 'No stack trace available'
            //     );
            //     this.errorLogger.error(errorLogString);
            //     throw error; // rethrow the error after logging
            // }),
        )
    }
}