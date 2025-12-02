import type { Withdrawal } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const myWithdrawalsPromise: Promise<Withdrawal[]> = getSafeResult(
		fetchAuthorizedApi(cookies, '/api/Withdrawal/shop/my-withdrawals?pageSize=99999999', 'GET'),
		[] as Withdrawal[]
	);

	return {
		myWithdrawalsPromise
	};
};

export const actions = {
	cancelWithdrawal: async ({ request, cookies }) => {
		const data = await request.formData();
		const withdrawalId = data.get('withdrawalId') as string;

		if (!withdrawalId) return fail(400, { message: 'Error, Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Withdrawal/shop/cancel/${withdrawalId}`,
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
