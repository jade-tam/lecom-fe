import { PUBLIC_API_URL } from '$env/static/public';
import type { ApiResponseBody } from '$lib/types/ApiResponseBody';
import type { Cookies } from '@sveltejs/kit';
import { clearTokens, storeTokens } from './others';
import type { ToastData } from './showToast';

export async function fetchApi<T = Record<string, unknown>>(
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body?: object,
	token?: string
): Promise<{ response: Response; responseBody: ApiResponseBody<T> }> {
	try {
		const response = await fetch(PUBLIC_API_URL + path, {
			method,
			headers: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: `Bearer ${token}` } : {})
			},
			body: method === 'GET' ? undefined : JSON.stringify(body)
		});

		let responseBody: ApiResponseBody<T>;

		// handle non-2xx before parsing JSON
		if (!response.ok) {
			responseBody = {
				statusCode: response.status,
				isSuccess: false,
				errorMessages: [`HTTP ${response.status} ${response.statusText}`],
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

			responseBody = {
				statusCode: response.status,
				isSuccess: false,
				errorMessages: [
					'Invalid JSON response from server.',
					`Raw response: ${rawText.slice(0, 200)}`
				],
				result: { message: 'Unexpected server error' } as T & { message: string }
			};
		}

		return { response, responseBody };
	} catch (error) {
		// network / fetch failed
		const responseBody: ApiResponseBody<T> = {
			statusCode: 500,
			isSuccess: false,
			errorMessages: [(error as Error).message],
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
	const token = cookies.get('token');
	const refreshToken = cookies.get('refreshToken');

	let { response, responseBody } = await fetchApi<T>(path, method, body, token);

	if (response?.status === 401 && refreshToken) {
		// Try refresh
		const refreshRes = await fetch(`${PUBLIC_API_URL}/api/Auth/refresh-token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken })
		});

		if (refreshRes.ok) {
			const refreshedBody = await refreshRes.json();

			storeTokens(cookies, refreshedBody.result.token, refreshedBody.result.refreshToken);

			// Retry the original request with new token
			({ response, responseBody } = await fetchApi<T>(
				path,
				method,
				body,
				refreshedBody.result.token
			));
		} else {
			clearTokens(cookies);
		}
	}

	return { response, responseBody };
}

export function getToastData(responseBody: ApiResponseBody<unknown>) {
	const responseToastData: ToastData = {
		type: responseBody.isSuccess ? 'success' : 'error',
		title: responseBody.isSuccess ? 'Logged In' : null,
		description: responseBody.isSuccess
			? responseBody.result.message
			: responseBody.errorMessages.join('. ')
	};

	return responseToastData;
}
