import { updateVoucherSchema } from '$lib/schemas/voucherSchema';
import type { Voucher } from '$lib/types/Voucher';
import { toDateInputValue } from '$lib/utils/converters.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ params, cookies }) => {
	const { id } = params;

	const voucher = await getSafeResult(
		fetchAuthorizedApi<Voucher>(cookies, `/api/admin/vouchers/${id}`, 'GET'),
		null
	);

	const form = await superValidate(
		{
			...voucher,
			startDate: voucher ? toDateInputValue(voucher?.startDate) : '',
			endDate: voucher ? toDateInputValue(voucher?.endDate) : ''
		},
		zod4(updateVoucherSchema)
	);

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(updateVoucherSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/vouchers/${formData.id}`,
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
