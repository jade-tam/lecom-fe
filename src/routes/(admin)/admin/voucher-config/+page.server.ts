import type { Voucher } from '$lib/types/Voucher.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = ({ cookies }) => {
	const vouchersPromise = getSafeResult(
		fetchAuthorizedApi<Voucher[]>(cookies, '/api/admin/vouchers', 'GET'),
		[] as Voucher[]
	);

	return {
		vouchersPromise
	};
};

export const actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Lỗi, không có ID' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/vouchers/${id}`,
			'DELETE'
		);

		const toastData = getToastData(responseBody, 'Phiếu giảm giá đã được xoá');

		return { toastData };
	}
};
