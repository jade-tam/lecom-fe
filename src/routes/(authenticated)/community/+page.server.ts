import { createCommentSchema } from '$lib/schemas/communityPostSchema.js';
import type { CommunityPost } from '$lib/types/CommunityPost.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import type { Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const communityPosts = await getSafeResult(
		fetchAuthorizedApi<CommunityPost[]>(cookies, `/api/community`, 'GET'),
		[] as CommunityPost[]
	);

	const communityPostsWithForms = await Promise.all(
		communityPosts.map(async (post) => {
			const form = await superValidate(
				{
					postId: post.id,
					body: ''
				},
				zod4(createCommentSchema),
				{
					id: 'post-form-' + post.id
				}
			);

			form.valid = true;

			return { ...post, form };
		})
	);

	return {
		communityPostsWithForms
	};
};

export const actions: Actions = {
	createComment: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(createCommentSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/community/${formData.postId}/comment`,
			'POST',
			{
				body: formData.body
			}
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Bình luận đã gửi.',
			'Không thể gửi bình luận.'
		);

		if (response.ok && responseBody.isSuccess) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
