import type { Cart } from '$lib/types/Cart.js';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';

export function load({ cookies, depends }) {
	depends('cart');

	const cartCountPromise: Promise<number> = fetchAuthorizedApi<Cart>(
		cookies,
		'/api/cart',
		'GET'
	).then((res) => (res.responseBody.isSuccess ? res.responseBody.result.items.length : 0));

	return {
		cartCountPromise
	};
}
