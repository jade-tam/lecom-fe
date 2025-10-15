export type ResponseBody = {
	isSuccess: boolean;
	errorMessages: string[];
	result: {
		message: string;
		[key: string]: unknown;
	};
};
