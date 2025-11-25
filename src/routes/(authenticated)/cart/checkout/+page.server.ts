import { checkoutSchema } from '$lib/schemas/checkoutSchema';
import type { Balance } from '$lib/types/Balance';
import type { Voucher } from '$lib/types/Voucher.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi.js';
import type { ToastData } from '$lib/utils/showToast.js';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ cookies }) {
	const checkoutForm = await superValidate(zod4(checkoutSchema));

	const balancePromise = getSafeResult<Balance | null>(
		fetchAuthorizedApi(cookies, '/api/Wallet/customer/balance', 'GET'),
		null
	);

	const myVouchersPromise = getSafeResult<Voucher[]>(
		fetchAuthorizedApi(cookies, '/api/vouchers/my', 'GET'),
		[]
	);

	return {
		balancePromise,
		myVouchersPromise,
		checkoutForm
	};
}

export const actions = {
	checkout: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(checkoutSchema));

		if (!form.valid) {
			return { form };
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/orders/checkout',
			'POST',
			{ ...formData, selectedProductIds: formData.selectedProductIds }
		);

		const toastData: ToastData = getToastData(responseBody, 'Đơn hàng đã được tạo.');

		if (response.ok) {
			return message(form, {
				toastData: toastData,
				responseResult: responseBody.result
			});
		} else {
			return message(
				form,
				{
					toastData: toastData,
					responseResult: responseBody.result
				},
				{ status: 400 }
			);
		}
	}
};
