import type { Shop } from '$lib/types/Shop.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies, params }) => {
	const id: string = params.id;
	const { responseBody } = await fetchAuthorizedApi<Shop>(cookies, `/api/Seller/${id}`, 'GET');

	return {
		shop: responseBody.result
	};
};

export const actions = {
	approve: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing shop id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Seller/admin/${id}/approve`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Shop approved');

		return { toastData };
	},

	reject: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');
		const reason = data.get('reason');

		if (!id) return fail(400, { message: 'Missing shop id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Seller/admin/${id}/reject`,
			'POST',
			{
				reason: reason
			}
		);

		const toastData = getToastData(responseBody, 'Shop rejected');

		return { toastData };
	}
};
