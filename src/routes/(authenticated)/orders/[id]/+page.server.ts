import { cancelOrderSchema } from '$lib/schemas/cancelOrderSchema.js';
import { createProductFeedbackSchema } from '$lib/schemas/orderFeedbackSchema';
import { createRefundSchema, type CreateRefundSchema } from '$lib/schemas/refundSchema.js';
import { type Order } from '$lib/types/Order.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';
import { message, fail as superFormFail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const order: Order | null = await getSafeResult(
		fetchAuthorizedApi<Order>(cookies, `/api/orders/${id}`, 'GET'),
		null
	);

	const refundFormData = await superValidate<CreateRefundSchema>(
		{
			orderId: id,
			reasonType: 'ProductIssue',
			reasonDescription: '',
			type: 'Full',
			refundAmount: 0
		},
		zod4(createRefundSchema)
	);

	const cancelOrderFormData = await superValidate(zod4(cancelOrderSchema));
	const createProductFeedbackFormData = await superValidate(zod4(createProductFeedbackSchema));

	return {
		order,
		refundFormData,
		cancelOrderFormData,
		createProductFeedbackFormData
	};
};

export const actions = {
	updateStatus: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { message: 'Error, Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(cookies, `/api/orders/${id}/confirm`, 'POST');

		const toastData = getToastData(
			responseBody,
			`Đơn hàng đã được xác nhận là đã nhận hàng.`,
			'Không thể xác nhận đơn hàng.'
		);

		return { toastData };
	},
	createRefund: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(createRefundSchema));

		if (!form.valid) {
			return superFormFail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Refund`,
			'POST',
			formData
		);

		const toastData = getToastData(
			responseBody,
			`Yêu cầu trả hàng hoàn tiền đã được gửi, vui lòng chờ xử lý.`,
			'Không thể gửi yêu cầu.'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	},
	cancelOrder: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod4(cancelOrderSchema));

		if (!form.valid) {
			return superFormFail(400, { form });
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
	},
	createOrderFeedback: async ({ request, cookies, params }) => {
		const form = await superValidate(request, zod4(createProductFeedbackSchema));

		if (!form.valid) {
			return superFormFail(400, { form });
		}

		const formData = form.data;
		const { id } = params;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Feedback/by-urls`,
			'POST',
			{ orderId: id, ...formData }
		);

		console.log(formData);

		const toastData = getToastData(responseBody, 'Đánh giá thành công.', 'Không thể đánh giá.');

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
