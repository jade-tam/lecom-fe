import type { Course, CourseWithDetail } from '$lib/types/Course';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export async function load({ params, cookies }) {
	const { slug } = params;

	const course: CourseWithDetail | null = await getSafeResult(
		fetchAuthorizedApi<CourseWithDetail>(cookies, `/api/home/courses/${slug}`, 'GET'),
		null
	);

	const similarCoursesPromise: Promise<Course[]> = getSafeResult(
		fetchAuthorizedApi(cookies, `/api/recombee/course/${course?.slug}/recommend`, 'GET'),
		[] as Course[]
	);

	return {
		similarCoursesPromise,
		course
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

		const toastData = getToastData(
			responseBody,
			'Khoá học đã được thêm vào danh sách học của bạn.'
		);

		return { toastData };
	}
};
