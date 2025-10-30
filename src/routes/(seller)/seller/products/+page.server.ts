import type { Product } from '$lib/types/Product.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<Product[]>(
		cookies,
		'/api/seller/products',
		'GET'
	);

	return {
		products: responseBody.result
	};
};

export const actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/products/${id}`,
			'DELETE'
		);

		const toastData = getToastData(responseBody, 'Product has been deleted');

		return { toastData };
	}
};
