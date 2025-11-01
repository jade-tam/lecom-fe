import type { Product } from '$lib/types/Product';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load() {
	const products = getSafeResult<Product[]>(fetchApi<Product[]>('/api/home/products', 'GET'), []);

	return {
		products
	};
}
