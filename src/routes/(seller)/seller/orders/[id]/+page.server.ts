import { cancelOrderSchema } from '$lib/schemas/cancelOrderSchema';
import { orderStatusOptions, type Order } from '$lib/types/Order.js';
import { getTitleFromOptionList } from '$lib/utils/converters.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, message } from 'sveltekit-superforms/client';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const order: Order | null = await getSafeResult(
		fetchAuthorizedApi<Order>(cookies, `/api/orders/${id}`, 'GET'),
		null
	);

	const cancelOrderFormData = await superValidate(zod4(cancelOrderSchema));

	return {
		order,
		cancelOrderFormData
	};
};

export const actions = {
	updateStatusSeller: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const status = data.get('status') as string;

		if (!id || !status) return fail(400, { message: 'Error, Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(cookies, `/api/orders/${id}/status`, 'PUT', {
			status: status
		});

		const toastData = getToastData(
			responseBody,
			`Đơn hàng đã được cập nhật trạng thái ${getTitleFromOptionList(status, orderStatusOptions)}.`,
			'Không thể cập nhật trạng thái của đơn hàng.'
		);

		return { toastData };
	},
	cancelOrder: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod4(cancelOrderSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;
		const { id } = params;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/orders/${id}/cancel`,
			'POST',
			formData
		);

		const toastData = getToastData(
			responseBody,
			'Đơn hàng đã được hủy thành công.',
			'Không thể hủy đơn hàng.'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
