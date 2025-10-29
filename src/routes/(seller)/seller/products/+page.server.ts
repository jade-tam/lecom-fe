import type { Product } from '$lib/types/Products.js';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';

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
