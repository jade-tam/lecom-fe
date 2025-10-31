import { PUBLIC_API_URL } from '$env/static/public';
import { createLogger, sanitizeForLog } from '$lib/server/logger';
import type { ApiResponseBody } from '$lib/types/ApiResponseBody';
import { type Cookies } from '@sveltejs/kit';
import { clearTokens, storeTokens } from './others';
import type { ToastData } from './showToast';

const logger = createLogger('API');

export async function fetchApi<T = Record<string, unknown>>(
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body?: unknown,
	token?: string
): Promise<{ response: Response; responseBody: ApiResponseBody<T> }> {
	const apiPrefix = `${method} ${path}`;
	logger.log(apiPrefix, 'Start fetching api...');

	const headers: Record<string, string> = {
		Accept: 'application/json'
	};
	let fetchBody: BodyInit | null | undefined = undefined;

	// Detect FormData (do NOT set Content-Type if sending FormData)
	const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

	if (isFormData) {
		fetchBody = body; // pass through FormData untouched
	} else if (body instanceof URLSearchParams) {
		// urlencoded form
		headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
		fetchBody = body.toString();
	} else if (body && typeof body === 'object') {
		// plain object -> JSON
		headers['Content-Type'] = 'application/json';
		fetchBody = JSON.stringify(body);
	} else if (typeof body === 'string') {
		fetchBody = body;
	}

	if (token) headers['Authorization'] = `Bearer ${token}`;

	try {
		const response = await fetch(PUBLIC_API_URL + path, {
			method,
			headers,
			body: fetchBody
		});

		let responseBody: ApiResponseBody<T>;

		// handle non-2xx before parsing JSON
		if (!response.ok) {
			const errorMessage = `HTTP ${response.status} ${response.statusText}`;

			logger.error(apiPrefix, 'Request failed', errorMessage);

			responseBody = {
				statusCode: response.status,
				isSuccess: false,
				errorMessages: [errorMessage],
				result: { message: 'Request failed' } as T & { message: string }
			};

			return { response, responseBody };
		}

		try {
			responseBody = (await response.json()) as ApiResponseBody<T>;
		} catch {
			// Try to read as text to see what the backend actually sent
			let rawText = '';
			try {
				rawText = await response.text();
			} catch {
				rawText = 'No response body';
			}

			const errorMessages = [
				'Invalid JSON response from server.',
				`Raw response: ${rawText.slice(0, 200)}`
			];

			logger.error(apiPrefix, ...errorMessages);

			responseBody = {
				statusCode: response.status,
				isSuccess: false,
				errorMessages: errorMessages,
				result: { message: 'Unexpected server error' } as T & { message: string }
			};
		}

		logger.log(apiPrefix, 'Success');
		const cleanedLog = sanitizeForLog(responseBody);
		logger.log(apiPrefix, 'DATA', cleanedLog);

		return { response, responseBody };
	} catch (error) {
		// network / fetch failed
		const errorMessage = (error as Error).message;

		logger.error(apiPrefix, errorMessage);

		const responseBody: ApiResponseBody<T> = {
			statusCode: 500,
			isSuccess: false,
			errorMessages: [errorMessage],
			result: { message: 'Network or server unreachable' } as T & { message: string }
		};

		return { response: new Response(), responseBody };
	}
}

export async function fetchAuthorizedApi<T>(
	cookies: Cookies,
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body?: object
) {
	const apiPrefix = `${method} ${path}`;

	const token = cookies.get('token');
	const refreshToken = cookies.get('refreshToken');

	let { response, responseBody } = await fetchApi<T>(path, method, body, token);

	if (response?.status === 401 && refreshToken) {
		logger.warn(apiPrefix, 'Unauthorized, try to refresh token');

		// Try refresh
		const refreshRes = await fetch(`${PUBLIC_API_URL}/api/Auth/refresh-token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken })
		});

		if (refreshRes.ok) {
			const refreshedBody = await refreshRes.json();

			storeTokens(cookies, refreshedBody.result.token, refreshedBody.result.refreshToken);

			logger.log(apiPrefix, 'Refresh token success, start fetching api again...');

			// Retry the original request with new token
			({ response, responseBody } = await fetchApi<T>(
				path,
				method,
				body,
				refreshedBody.result.token
			));
		} else {
			logger.warn(apiPrefix, "Can't refresh new token");

			clearTokens(cookies);
		}
	}

	return { response, responseBody };
}

export function getToastData(responseBody: ApiResponseBody<unknown>, fallbackMessage?: string) {
	const responseToastData: ToastData = {
		type: responseBody.isSuccess ? 'success' : 'error',
		title: responseBody.isSuccess ? 'Success' : null,
		description: responseBody.isSuccess
			? (responseBody.result.message ?? fallbackMessage)
			: responseBody.errorMessages.join('. ')
	};

	return responseToastData;
}

export function getSafeResult<T>(p: Promise<{ responseBody: { result: T } }>, fallback: T) {
	return p
		.then((r) => r.responseBody.result)
		.catch((err) => {
			logger.error('getSafeResult', err);
			return fallback;
		});
}
