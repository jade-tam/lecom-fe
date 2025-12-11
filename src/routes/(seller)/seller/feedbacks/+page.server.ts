import { replyFeedbackSchema } from '$lib/schemas/replyFeedbackSchema.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const replyFeedbackFormData = await superValidate(zod4(replyFeedbackSchema));

	return {
		replyFeedbackFormData
	};
};

export const actions = {
	replyFeedback: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(replyFeedbackSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { feedbackId, type, ...formData } = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Feedback/${feedbackId}/reply`,
			type === 'create' ? 'POST' : 'PUT',
			formData
		);

		const toastData = getToastData(
			responseBody,
			'Phản hồi đã được gửi thành công.',
			'Không thể gửi phản hồi.'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
