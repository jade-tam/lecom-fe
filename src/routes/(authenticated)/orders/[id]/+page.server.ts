import type { Order } from '$lib/types/Order.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const order: Order | null = await getSafeResult(
		fetchAuthorizedApi<Order>(cookies, `/api/orders/${id}`, 'GET'),
		null
	);

	return {
		order
	};
};
