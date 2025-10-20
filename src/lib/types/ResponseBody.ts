export type ApiResponseBody<T = Record<string, unknown>> = {
	statusCode: number;
	isSuccess: boolean;
	errorMessages: string[];
	result: T & { message: string };
};
