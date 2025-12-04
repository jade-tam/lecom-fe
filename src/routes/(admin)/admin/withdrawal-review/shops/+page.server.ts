import type { AdminShopWithdrawal } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const shopWithdrawalsPromise: Promise<AdminShopWithdrawal[]> = getSafeResult(
		fetchAuthorizedApi(cookies, '/api/Withdrawal/admin/shop/pending', 'GET'),
		[] as AdminShopWithdrawal[]
	);

	return {
		shopWithdrawalsPromise
	};
};
