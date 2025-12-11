import { moderatorActionSchema } from '$lib/schemas/moderatorSchema.js';
import type { Course } from '$lib/types/Course.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const pendingCourses = await getSafeResult(
		fetchAuthorizedApi<Course[]>(cookies, '/api/moderator/courses/pending', 'GET'),
		[] as Course[]
	);

	return {
		pendingCourses
	};
};

export const actions = {
	approve: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(moderatorActionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/moderator/courses/${id}/approve`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Đã chấp thuận khóa học');

		return { toastData };
	},
	reject: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(moderatorActionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/moderator/courses/${id}/reject`,
			'POST',
			{
				reason: 'Khóa học không đáp ứng tiêu chuẩn của chúng tôi. Vui lòng xem lại và thử lại.'
			}
		);

		const toastData = getToastData(responseBody, 'Đã từ chối khóa học');

		return { toastData };
	}
};
