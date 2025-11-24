import type { RedeemRule } from '$lib/types/Gamification.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = ({ cookies }) => {
	const redeemRulesPromise = getSafeResult(
		fetchAuthorizedApi<RedeemRule[]>(cookies, '/api/admin/redeem-rules', 'GET'),
		[] as RedeemRule[]
	);

	return {
		redeemRulesPromise
	};
};

export const actions = {
	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Lỗi, không có ID' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/redeem-rules/${id}`,
			'DELETE'
		);

		const toastData = getToastData(responseBody, 'Mục đổi thưởng đã được xoá');

		return { toastData };
	}
};
