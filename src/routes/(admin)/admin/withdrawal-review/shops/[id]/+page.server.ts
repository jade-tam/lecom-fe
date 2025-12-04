import { reviewWithdrawalSchema } from '$lib/schemas/withdrawSchema.js';
import type { WithdrawalDetail } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const withdrawalPromise: Promise<WithdrawalDetail | null> = getSafeResult(
		fetchAuthorizedApi(cookies, `/api/Withdrawal/admin/shop/${id}`, 'GET'),
		null
	);

	const form = await superValidate(zod4(reviewWithdrawalSchema));

	return {
		withdrawalPromise,
		form
	};
};

export const actions = {
	reviewWithdrawal: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod4(reviewWithdrawalSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = params;
		const withdrawalId = id;
		const { action, ...formData } = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Withdrawal/admin/shop/${action}/${withdrawalId}`,
			'POST',
			formData
		);

		const toastData = getToastData(
			responseBody,
			action === 'approve' ? `Đã chấp nhận yêu cầu rút tiền.` : `Đã từ chối yêu cầu rút tiền.`,
			'Không thể xử lý yêu cầu.'
		);

		if (response.ok && responseBody.isSuccess) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
