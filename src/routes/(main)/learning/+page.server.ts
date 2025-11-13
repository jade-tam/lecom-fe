import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course';
import type { PaginatedResult } from '$lib/types/PaginatedResult';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load() {
	const queryResult = getSafeResult(fetchApi<PaginatedResult<Course>>(`/api/home/courses`, 'GET'), {
		totalItems: 0,
		page: 1,
		pageSize: 12,
		totalPages: 0,
		items: []
	} as PaginatedResult<Course>);

	const categories = getSafeResult(
		fetchApi<Category[]>('/api/CourseCategory', 'GET'),
		[] as Category[]
	);
	return {
		queryResult: queryResult,
		categories: categories
	};
}
