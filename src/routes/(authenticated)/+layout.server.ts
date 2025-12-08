import type { Cart } from '$lib/types/Cart.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export function load({ cookies, depends }) {
	depends('cart');

	const cartPromise: Promise<Cart | null> = getSafeResult(
		fetchAuthorizedApi<Cart>(cookies, '/api/cart', 'GET'),
		null
	);

	return {
		cartPromise: cartPromise
	};
}
