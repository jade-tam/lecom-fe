import { reviewRefundSchema } from '$lib/schemas/refundSchema';
import type { PlatformConfigFull } from '$lib/types/PlatformConfig.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<unknown>(
		cookies,
		'/api/PlatformConfig/admin/full',
		'GET'
	);

	// @ts-ignore
	const platformConfig: PlatformConfigFull = responseBody.data;
	// const reviewRefundFormData = await superValidate<ReviewRefundSchema>(zod4(reviewRefundSchema));

	return {
		platformConfig
		// reviewRefundFormData
	};
};

export const actions = {
	reviewRefund: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(reviewRefundSchema));

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { refundId, ...formData } = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Refund/admin/${refundId}/decision`,
			'POST',
			formData
		);

		const toastData = getToastData(
			responseBody,
			formData.approve ? `Đã chấp nhận yêu cầu hoàn tiền.` : `Đã từ chối yêu cầu hoàn tiền.`,
			'Không thể xử lý yêu cầu.'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
