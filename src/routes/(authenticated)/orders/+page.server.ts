import type { Order } from '$lib/types/Order.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const orders = await getSafeResult(
		fetchAuthorizedApi<Order[]>(cookies, '/api/orders/my', 'GET'),
		[] as Order[]
	);

	return {
		orders
	};
};
