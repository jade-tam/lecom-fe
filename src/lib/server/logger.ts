export const createLogger = (prefix: string) => ({
	log: (...args: any[]) => console.log(`[${prefix}]`, ...args),
	warn: (...args: any[]) => console.warn(`[${prefix}]`, ...args),
	error: (...args: any[]) => console.error(`[${prefix}]`, ...args)
});
