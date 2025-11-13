import type { Category } from '$lib/types/Category.js';
import type { Course } from '$lib/types/Course';
import type { PaginatedResult } from '$lib/types/PaginatedResult.js';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi.js';

export function load({ url }) {
	const params = new URLSearchParams();

	const search = url.searchParams.get('search');
	const category = url.searchParams.get('category');
	const sort = url.searchParams.get('sort');
	const page = url.searchParams.get('page');

	// Only include params that actually exist
	if (search) params.set('search', search);
	if (category) params.set('category', category);
	if (sort) params.set('sort', sort);
	if (page) params.set('page', page);
	params.set('pageSize', '12'); // HARD FIX PAGE SIZE

	const queryResult = getSafeResult(
		fetchApi<PaginatedResult<Course>>(`/api/home/courses?${params.toString()}`, 'GET'),
		{ totalItems: 0, page: 1, pageSize: 12, totalPages: 0, items: [] } as PaginatedResult<Course>
	);

	const categories = getSafeResult(
		fetchApi<Category[]>('/api/CourseCategory', 'GET'),
		[] as Category[]
	);

	return {
		queryResult: queryResult,
		categories: categories
	};
}
