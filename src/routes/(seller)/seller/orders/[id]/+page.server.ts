import { orderStatusOptions, type Order } from '$lib/types/Order.js';
import { getTitleFromOptionList } from '$lib/utils/converters.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from 'sveltekit-superforms/client';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const order: Order | null = await getSafeResult(
		fetchAuthorizedApi<Order>(cookies, `/api/orders/${id}`, 'GET'),
		null
	);

	return {
		order
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
	}
};
