import type { Shop } from '$lib/types/Shop.js';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<Shop[]>(cookies, '/api/Seller/admin', 'GET');

	return {
		shops: responseBody.result
	};
};
