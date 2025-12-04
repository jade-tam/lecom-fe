import type { AdminWithdrawal } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const shopWithdrawalsPromise: Promise<AdminWithdrawal[]> = getSafeResult(
		fetchAuthorizedApi(cookies, '/api/Withdrawal/admin/shop/pending', 'GET'),
		[] as AdminWithdrawal[]
	);

	return {
		shopWithdrawalsPromise
	};
};

export const actions = {
	cancelWithdrawal: async ({ request, cookies }) => {
		const data = await request.formData();
		const withdrawalId = data.get('withdrawalId') as string;

		if (!withdrawalId) return fail(400, { message: 'Error, Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Withdrawal/customer/cancel/${withdrawalId}`,
			'POST'
		);

		const toastData = getToastData(
			responseBody,
			`Yêu cầu rút tiền đã được huỷ.`,
			'Không thể huỷ yêu cầu rút tiền.'
		);

		return { toastData };
	}
};
