import type { CourseWithDetail } from '$lib/types/Course';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

export async function load({ params }) {
	const { slug } = params;

	const course: CourseWithDetail | null = await getSafeResult(
		fetchApi<CourseWithDetail>(`/api/home/courses/${slug}`, 'GET'),
		null
	);

	return {
		course: course
	};
}

export const actions = {};
