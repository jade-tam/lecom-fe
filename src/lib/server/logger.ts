export function sanitizeForLog(obj: any): any {
	if (obj == null) return obj;

	// If string looks like base64 image, shorten or mask it
	if (typeof obj === 'string' && obj.startsWith('data:image/')) {
		return '[base64 image omitted]';
	}

	// Recursively sanitize objects and arrays
	if (Array.isArray(obj)) return obj.map(sanitizeForLog);
	if (typeof obj === 'object') {
		const clean: Record<string, any> = {};
		for (const [key, value] of Object.entries(obj)) {
			clean[key] = sanitizeForLog(value);
		}
		return clean;
	}

	return obj;
}

export const createLogger = (prefix: string) => ({
	log: (...args: any[]) => console.log(`[${prefix}]`, ...args),
	warn: (...args: any[]) => console.warn(`[${prefix}]`, ...args),
	error: (...args: any[]) => console.error(`[${prefix}]`, ...args)
});
