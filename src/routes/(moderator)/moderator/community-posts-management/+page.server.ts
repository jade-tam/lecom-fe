import { moderatorActionSchema } from '$lib/schemas/moderatorSchema.js';
import type { ModeratorPendingCommunityPost } from '$lib/types/CommunityPost.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const moderatorPendingCommunityPostsPromise = getSafeResult(
		fetchAuthorizedApi<ModeratorPendingCommunityPost[]>(cookies, '/api/community/pending', 'GET'),
		[] as ModeratorPendingCommunityPost[]
	);

	return {
		moderatorPendingCommunityPostsPromise: moderatorPendingCommunityPostsPromise
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
			`/api/community/${id}/approve`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Đã chấp thuận bài viết');

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
			`/api/community/${id}/reject`,
			'POST',
			{
				reason: 'Bài viết của bạn không phù hợp'
			}
		);

		const toastData = getToastData(responseBody, 'Đã từ chối bài viết');
		return { toastData };
	}
};
