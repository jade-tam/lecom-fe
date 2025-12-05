import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course';
import type { PaginatedResult } from '$lib/types/PaginatedResult';
import { fetchApi, fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

type CourseBrowse = {
	recommendedCourses: Course[];
	recommendedCategories: {
		id: string;
		name: string;
		slug: string;
		courses: Course[];
	}[];
	newArrivalCourses: Course[];
	popularCategories: {
		id: string;
		name: string;
		slug: string;
		count: number;
	}[];
};

export async function load({ cookies }) {
	const queryResult = getSafeResult(fetchApi<PaginatedResult<Course>>(`/api/home/courses`, 'GET'), {
		totalItems: 0,
		page: 1,
		pageSize: 12,
		totalPages: 0,
		items: []
	} as PaginatedResult<Course>);

	const courseBrowseDataPromise: Promise<CourseBrowse | null> = getSafeResult(
		fetchAuthorizedApi<CourseBrowse>(cookies, `/api/recombee/browse/courses`, 'GET'),
		null
	);

	const categories = getSafeResult(
		fetchApi<Category[]>('/api/CourseCategory', 'GET'),
		[] as Category[]
	);
	return {
		queryResult: queryResult,
		categories: categories,
		courseBrowseDataPromise
	};
}
