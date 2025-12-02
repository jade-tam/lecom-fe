import type { Category } from '$lib/types/Category';
import type { PaginatedResult } from '$lib/types/PaginatedResult';
import type { Product } from '$lib/types/Product';
import { fetchApi, fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

type ProductBrowse = {
	recommendedProducts: Product[];
	recommendedCategories: {
		id: string;
		name: string;
		slug: string;
		products: Product[];
	}[];
	trendingProducts: Product[];
	bestSellerProducts: Product[];
	newArrivalProducts: Product[];
};

export async function load({ cookies }) {
	const queryResult = getSafeResult(
		fetchApi<PaginatedResult<Product>>(`/api/home/products`, 'GET'),
		{ totalItems: 0, page: 1, pageSize: 12, totalPages: 0, items: [] } as PaginatedResult<Product>
	);
	const productBrowseDataPromise: Promise<ProductBrowse | null> = getSafeResult(
		fetchAuthorizedApi<ProductBrowse>(cookies, `/api/recombee/browse/products`, 'GET'),
		null
	);

	const categories = getSafeResult(
		fetchApi<Category[]>('/api/productcategory', 'GET'),
		[] as Category[]
	);
	return {
		productBrowseDataPromise: productBrowseDataPromise,
		queryResult: queryResult,
		categories: categories
	};
}
