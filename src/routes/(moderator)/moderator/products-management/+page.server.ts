import { moderatorActionSchema } from '$lib/schemas/moderatorSchema.js';
import type { Product } from '$lib/types/Product.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const pendingProducts = await getSafeResult(
		fetchAuthorizedApi<Product[]>(cookies, '/api/moderator/products/pending', 'GET'),
		[] as Product[]
	);

	return {
		pendingProducts
	};
};

export const actions = {
	approve: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(moderatorActionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/moderator/products/${id}/approve`,
			'POST'
		);

		const toastData = getToastData(responseBody, 'Đã chấp thuận sản phẩm');

		return { toastData };
	},
	reject: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(moderatorActionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id } = form.data;

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/moderator/products/${id}/reject`,
			'POST',
			{
				reason: 'Sản phẩm không đáp ứng tiêu chuẩn của chúng tôi. Vui lòng xem lại và thử lại.'
			}
		);

		const toastData = getToastData(responseBody, 'Đã từ chối sản phẩm');

		return { toastData };
	}
};
