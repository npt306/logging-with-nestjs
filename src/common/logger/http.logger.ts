import { Injectable, LoggerService } from '@nestjs/common'
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFile } from 'winston/lib/winston/transports';

export const winstonHttpLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`,

        )
    ),
    transports: [
        new DailyRotateFile({
            filename: 'logs/http-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
        }),
    ]
})

export class HttpLogger implements LoggerService {

    log(message: any, ...optionalParams: any[]) {
        winstonHttpLogger.info(message, ...optionalParams);
    }

    error(message: any, ...optionalParams: any[]) {
        console.error('Http logger error: ', message, ...optionalParams);
    }

    warn(message: any, ...optionalParams: any[]) {
        console.warn('Http logger warn: ', message, ...optionalParams);
    }
}

