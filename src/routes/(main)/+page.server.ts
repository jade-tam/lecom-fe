import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course';
import type { Product } from '$lib/types/Product';
import { fetchApi } from '$lib/utils/externalApi';

export async function load() {
	const { responseBody: courseCategories } = await fetchApi<Category[]>(
		'/api/CourseCategory',
		'GET'
	);
	const { responseBody: productCategories } = await fetchApi<Category[]>(
		'/api/productcategory',
		'GET'
	);
	const { responseBody: coursesResBody } = await fetchApi<Course[]>('/api/home/courses', 'GET');
	const { responseBody: productsResBody } = await fetchApi<Product[]>('/api/home/products', 'GET');

	return {
		courseCategories: courseCategories.result,
		productCategories: productCategories.result,
		popularCourses: coursesResBody.result,
		bestSellerProducts: productsResBody.result
	};
}
