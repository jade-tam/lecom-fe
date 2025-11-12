import type { Course } from '$lib/types/Course.js';
import type { Product } from '$lib/types/Product.js';
import type { Shop } from '$lib/types/Shop.js';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load({ params }) {
	const { id } = params;

	const {
		shop,
		products,
		courses
	}: {
		shop: Shop | null;
		products: Product[];
		courses: Course[];
	} = await getSafeResult(fetchApi(`/api/home/${id}`, 'GET'), {
		shop: null,
		products: [],
		courses: [],
		message: ''
	});

	return {
		shop,
		products,
		courses
	};
}
