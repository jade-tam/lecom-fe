import { createVoucherSchema } from '$lib/schemas/voucherSchema';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(createVoucherSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(createVoucherSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/admin/vouchers',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Mã giảm giá đã được tạo');

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
