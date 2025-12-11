import { moderatorActionSchema } from '$lib/schemas/moderatorSchema.js';
import type { ModeratorPendingLesson } from '$lib/types/Course.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const pendingSections = await getSafeResult(
		fetchAuthorizedApi<ModeratorPendingLesson[]>(cookies, '/api/moderator/sections/pending', 'GET'),
		[] as ModeratorPendingLesson[]
	);

	return {
		pendingSections
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
			`/api/moderator/sections/${id}/approve`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Đã chấp thuận duyệt chương học');

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
			`/api/moderator/sections/${id}/reject`,
			'POST',
			{
				reason:
					'Chương học không đáp ứng tiêu chuẩn của chúng tôi. Vui lòng kiểm tra lại thông tin và thử lại.'
			}
		);

		const toastData = getToastData(responseBody, 'Đã từ chối bài học');
		return { toastData };
	}
};
