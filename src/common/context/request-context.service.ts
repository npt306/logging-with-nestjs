import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface RequestContext {
    requestId: string;
}

@Injectable()
export class RequestContextService {



    private readonly asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

    run(context: RequestContext, callback: (...args: any[]) => void) {
        this.asyncLocalStorage.run(context, callback)
    }

    getStore<T extends keyof RequestContext>(key: T): RequestContext[T] | undefined {
        const store = this.asyncLocalStorage.getStore();
        return store?.[key];
    }

    getRequestId(): string | undefined {
        return this.getStore('requestId');
    }
}