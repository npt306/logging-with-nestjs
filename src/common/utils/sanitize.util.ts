// src/common/utils/sanitize-deep.util.ts
export function sanitizeSensitiveFields(
    obj: any,
    sensitiveFields: string[] = ['password', 'token', 'accessToken', 'refreshToken']
): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeSensitiveFields(item, sensitiveFields));
    }

    const sanitizedObj: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.includes(key)) {
            sanitizedObj[key] = '***';
        } else if (typeof value === 'object' && value !== null) {
            sanitizedObj[key] = sanitizeSensitiveFields(value, sensitiveFields);
        } else {
            sanitizedObj[key] = value;
        }
    }

    return sanitizedObj;
}
