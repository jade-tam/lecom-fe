import { PUBLIC_API_URL } from '$env/static/public';
import type { ResponseBody } from '$lib/types/ResponseBody';
import type { ToastData } from './showToast';

export async function fetchApi(
	path: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body: object
) {
	const response = await fetch(PUBLIC_API_URL + path, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	const responseBody: ResponseBody = await response.json();

	return { response, responseBody };
}

export function getToastData(responseBody: ResponseBody) {
	const responseToastData: ToastData = {
		type: responseBody.isSuccess ? 'success' : 'error',
		title: responseBody.isSuccess ? 'Logged In' : null,
		description: responseBody.isSuccess
			? responseBody.result.message
			: responseBody.errorMessages.join('. ')
	};

	return responseToastData;
}
