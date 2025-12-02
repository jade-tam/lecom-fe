import type { Withdrawal } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const myWithdrawalsPromise: Promise<Withdrawal[]> = getSafeResult(
		fetchAuthorizedApi(cookies, '/api/Withdrawal/shop/my-withdrawals?pageSize=99999999', 'GET'),
		[] as Withdrawal[]
	);

	return {
		myWithdrawalsPromise
	};
};
