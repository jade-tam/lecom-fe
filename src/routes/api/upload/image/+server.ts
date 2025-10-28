import { fetchAuthorizedApi } from '$lib/utils/externalApi';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (event) => {
	const cookies = event.cookies; // access secure cookies
	const formData = await event.request.formData();

	// Example: upload to backend that expects multipart form data
	const { response, responseBody } = await fetchAuthorizedApi(
		cookies,
		'/api/Upload/image',
		'POST',
		formData
	);

	return new Response(JSON.stringify(responseBody), {
		status: response.status,
		headers: {
			'content-type': 'application/json; charset=utf-8'
		}
	});
};
