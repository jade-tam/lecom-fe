import type { Category } from '$lib/types/Category';
import type { PaginatedResult } from '$lib/types/PaginatedResult';
import type { Product } from '$lib/types/Product';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load() {
	const queryResult = getSafeResult(
		fetchApi<PaginatedResult<Product>>(`/api/home/products`, 'GET'),
		{ totalItems: 0, page: 1, pageSize: 12, totalPages: 0, items: [] } as PaginatedResult<Product>
	);

	const categories = getSafeResult(
		fetchApi<Category[]>('/api/productcategory', 'GET'),
		[] as Category[]
	);
	return {
		queryResult: queryResult,
		categories: categories
	};
}
