import type { User } from '$lib/types/User.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<User[]>(cookies, '/api/admin/user/all', 'GET');

	return {
		users: responseBody.result
	};
};

export const actions = {
	activate: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/user/activate/${id}`,
			'PUT'
		);

		const toastData = getToastData(responseBody, 'User has been activated');

		return { toastData };
	},

	deactivate: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/user/deactivate/${id}`,
			'PUT'
		);

		const toastData = getToastData(responseBody, 'User has been deactivated');

		return { toastData };
	},

	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(cookies, `/api/admin/user/${id}`, 'DELETE');

		const toastData = getToastData(responseBody, 'User has been deleted');

		return { toastData };
	}
};
