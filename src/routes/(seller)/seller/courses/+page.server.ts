import type { Course } from '$lib/types/Course.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<Course[]>(
		cookies,
		'/api/seller/courses/my',
		'GET'
	);

	return {
		courses: responseBody.result
	};
};

export const actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/${id}`,
			'DELETE'
		);

		const toastData = getToastData(responseBody, 'Course has been deleted');

		return { toastData };
	}
};
