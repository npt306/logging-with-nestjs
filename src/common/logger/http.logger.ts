import { Injectable, LoggerService } from '@nestjs/common'
import { info } from 'console';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFile } from 'winston/lib/winston/transports';


const infoOnly = winston.format((info) => {
    return info.level === 'info' ? info : false;
});

const errorOnly = winston.format((info) => {
    return info.level === 'error' ? info : false;
});

export const winstonHttpLogger = winston.createLogger({
    transports: [
        new DailyRotateFile({
            filename: 'logs/full-http-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
        new DailyRotateFile({
            filename: 'logs/http-info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info',
            format: infoOnly(),
        }),
        new DailyRotateFile({
            filename: 'logs/http-error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
            format: errorOnly(),
        }),
    ]
})

export class HttpLogger implements LoggerService {

    log(message: any) {
        winstonHttpLogger.log(message);
    }

    info(message: any, ...optionalParams: any[]) {
        if (typeof message === 'object') {
            const logMessage = { ...message, level: 'info' };
            winstonHttpLogger.log(logMessage);
        } else {
            winstonHttpLogger.info(message, ...optionalParams);
        }
    }

    error(message: any, ...optionalParams: any[]) {
        if (typeof message === 'object') {
            const logMessage = { ...message, level: 'error' };
            winstonHttpLogger.log(logMessage);
        } else {
            winstonHttpLogger.error(message, ...optionalParams);
        }
    }

    warn(message: any, ...optionalParams: any[]) {
        console.warn('Http logger warn: ', message, ...optionalParams);
    }
}

