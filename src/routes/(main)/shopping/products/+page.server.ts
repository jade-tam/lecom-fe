import type { Category } from '$lib/types/Category.js';
import type { PaginatedResult } from '$lib/types/PaginatedResult.js';
import type { Product } from '$lib/types/Product';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi.js';

export function load({ url }) {
	const params = new URLSearchParams();

	const search = url.searchParams.get('search');
	const category = url.searchParams.get('category');
	const sort = url.searchParams.get('sort');
	const page = url.searchParams.get('page');
	const minPrice = url.searchParams.get('minPrice');
	const maxPrice = url.searchParams.get('maxPrice');

	// Only include params that actually exist
	if (search) params.set('search', search);
	if (category) params.set('category', category);
	if (sort) params.set('sort', sort);
	if (page) params.set('page', page);
	params.set('pageSize', '12'); // HARD FIX PAGE SIZE
	if (minPrice) params.set('minPrice', minPrice);
	if (maxPrice) params.set('maxPrice', maxPrice);

	const queryResult = getSafeResult(
		fetchApi<PaginatedResult<Product>>(`/api/home/products?${params.toString()}`, 'GET'),
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
