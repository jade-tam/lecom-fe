import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course';
import type { Product } from '$lib/types/Product';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load() {
	const courseCategories = getSafeResult(
		fetchApi<Category[]>('/api/CourseCategory', 'GET'),
		[] as Category[]
	);

	const productCategories = getSafeResult(
		fetchApi<Category[]>('/api/productcategory', 'GET'),
		[] as Category[]
	);

	const popularCourses = getSafeResult(
		fetchApi<Course[]>('/api/home/courses', 'GET'),
		[] as Course[]
	);

	const bestSellerProducts = getSafeResult(
		fetchApi<Product[]>('/api/home/products', 'GET'),
		[] as Product[]
	);

	return {
		courseCategories,
		productCategories,
		popularCourses,
		bestSellerProducts
	};
}
