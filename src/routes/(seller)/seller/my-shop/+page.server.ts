import type { Course } from '$lib/types/Course';
import type { Product } from '$lib/types/Product';
import type { Shop } from '$lib/types/Shop.js';
import { fetchAuthorizedApi, fetchApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<Shop>(cookies, '/api/Seller/my-shop', 'GET');

	const {
		shop,
		products,
		courses
	}: {
		shop: Shop | null;
		products: Product[];
		courses: Course[];
	} = await getSafeResult(fetchApi(`/api/home/${responseBody.result.id}`, 'GET'), {
		shop: null,
		products: [],
		courses: []
	});

	return {
		shop,
		products,
		courses
	};
};
