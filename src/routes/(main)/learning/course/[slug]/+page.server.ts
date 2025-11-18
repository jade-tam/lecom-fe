import type { CourseWithDetail } from '$lib/types/Course';
import { fetchApi, fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

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

export const actions = {
	enroll: async ({ request, cookies }) => {
		const data = await request.formData();
		const courseId = data.get('courseId');

		if (!courseId) return fail(400, { message: 'Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/courses/${courseId}/enroll`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Course enrolled');

		return { toastData };
	}
};
