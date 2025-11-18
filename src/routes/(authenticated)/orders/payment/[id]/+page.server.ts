import type { OrderPaymentGroup } from '$lib/types/OrderPaymentGroup.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const orderPaymentGroup: OrderPaymentGroup | null = await getSafeResult(
		fetchAuthorizedApi<OrderPaymentGroup>(cookies, '/api/Payment/create-payment-link', 'POST', {
			orderId: id
		}),
		null
	);

	return {
		orderPaymentGroup
	};
};
