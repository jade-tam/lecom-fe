import type { CourseLearning } from '$lib/types/Course.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';

export async function load({ cookies, params }) {
	const { id } = params;

	const courseLearning: CourseLearning | null = await getSafeResult(
		fetchAuthorizedApi<CourseLearning>(cookies, `/api/courses/${id}/learn`, 'GET'),
		null
	);

	console.log(JSON.stringify(courseLearning, null, 4));

	return {
		courseLearning
	};
}

export const actions = {
	completeLesson: async ({ cookies, request }) => {
		const formData = await request.formData();
		const lessonId = formData.get('lessonId') as string;

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/courses/lessons/${lessonId}/complete`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Bài học đã hoàn thành');

		return { toastData, responseBody };
	}
};
