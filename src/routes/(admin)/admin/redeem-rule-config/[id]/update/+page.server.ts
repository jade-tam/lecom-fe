import { updateRedeemRuleSchema } from '$lib/schemas/redeemRewardSchema';
import type { Voucher } from '$lib/types/Voucher';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ params, cookies }) => {
	const { id } = params;

	const redeemRule = await getSafeResult(
		fetchAuthorizedApi<Voucher>(cookies, `/api/admin/redeem-rules/${id}`, 'GET'),
		null
	);

	const form = await superValidate(redeemRule, zod4(updateRedeemRuleSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(updateRedeemRuleSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/redeem-rules/${formData.id}`,
			'PUT',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Mã giảm giá đã được cập nhật');

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
