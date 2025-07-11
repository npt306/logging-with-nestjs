
import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFile } from 'winston/lib/winston/transports';

export const winstonErrorLogger = winston.createLogger({
    transports: [
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),
    ]
})

export class ErrorLogger implements LoggerService {

    log(message: any, ...optionalParams: any[]) {
        console.log('Error logger info: ', message, ...optionalParams);
    }

    error(message: any, ...optionalParams: any[]) {
        if (typeof message === 'object') {
            const logMessage = { ...message, level: 'error' };
            winstonErrorLogger.log(logMessage);
        } else {
            winstonErrorLogger.error(message, ...optionalParams);
        }
    }

    warn(message: any, ...optionalParams: any[]) {
        console.warn('Error logger warn: ', message, ...optionalParams);
    }
}

