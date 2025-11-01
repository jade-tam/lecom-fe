import type { Course } from '$lib/types/Course';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load() {
	const courses = getSafeResult<Course[]>(fetchApi<Course[]>('/api/home/courses', 'GET'), []);

	return {
		courses
	};
}
