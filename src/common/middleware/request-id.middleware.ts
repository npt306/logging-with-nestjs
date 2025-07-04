import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestContextService } from '../context/request-context.service';
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    constructor(private readonly requestContextService: RequestContextService) {
    }
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = uuidv4();
        req['requestId'] = requestId;
        this.requestContextService.run({ requestId }, () => { next(); });
    }
}