import type { Order } from '$lib/types/Order.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = ({ cookies }) => {
	const ordersPromise = getSafeResult(
		fetchAuthorizedApi<Order[]>(cookies, '/api/orders/shop/my', 'GET'),
		[] as Order[]
	);

	return {
		ordersPromise
	};
};
