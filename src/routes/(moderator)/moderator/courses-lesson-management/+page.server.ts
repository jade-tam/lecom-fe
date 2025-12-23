import { moderatorActionSchema } from '$lib/schemas/moderatorSchema.js';
import type { ModeratorPendingLesson } from '$lib/types/Course.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const pendingLessons = await getSafeResult(
		fetchAuthorizedApi<ModeratorPendingLesson[]>(cookies, '/api/moderator/lessons/pending', 'GET'),
		[] as ModeratorPendingLesson[]
	);

	return {
		pendingLessons
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
			`/api/moderator/lessons/${id}/approve`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Đã chấp thuận duyệt bài học');

		return { toastData };
	},
	reject: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(moderatorActionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, reason } = form.data;

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/moderator/lessons/${id}/reject`,
			'POST',
			{
				reason: reason
			}
		);

		const toastData = getToastData(responseBody, 'Đã từ chối bài học');
		return { toastData };
	}
};
