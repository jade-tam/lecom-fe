import type { Cart } from '$lib/types/Cart.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export async function load({ cookies }) {
	const cart: Cart | null = await getSafeResult(
		fetchAuthorizedApi<Cart>(cookies, '/api/cart', 'GET'),
		null
	);

	return {
		cart
	};
}

export const actions = {
	updateItemCount: async ({ request, cookies }) => {
		const data = await request.formData();
		const productId = data.get('productId');
		const quantity = data.get('quantity');

		if (!productId || !quantity) return fail(400, { message: 'Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(cookies, '/api/cart/items', 'POST', {
			productId: productId,
			quantity: Number(quantity)
		});

		const toastData = getToastData(responseBody, 'Item count updated');

		return { toastData };
	},

	deleteItem: async ({ request, cookies }) => {
		const data = await request.formData();
		const productId = data.get('productId');

		if (!productId) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/cart/items/${productId}`,
			'DELETE'
		);

		const toastData = getToastData(responseBody, 'Item removed');

		return { toastData };
	}
};
