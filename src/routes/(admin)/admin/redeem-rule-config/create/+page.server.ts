import { createRedeemRuleSchema } from '$lib/schemas/redeemRewardSchema';
import type { Voucher } from '$lib/types/Voucher';
import { getSafeResult } from '$lib/utils/externalApi';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const vouchersPromise = getSafeResult(
		fetchAuthorizedApi<Voucher[]>(cookies, '/api/admin/vouchers', 'GET'),
		[] as Voucher[]
	);

	const form = await superValidate(zod4(createRedeemRuleSchema));

	return { vouchersPromise, form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(createRedeemRuleSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		console.log(formData);

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/admin/redeem-rules',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Mục đổi thưởng đã được tạo');

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
