import type { WithdrawalDetail } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const withdrawalPromise: Promise<WithdrawalDetail | null> = getSafeResult(
		fetchAuthorizedApi(cookies, `/api/Withdrawal/shop/my/${id}`, 'GET'),
		null
	);

	return {
		withdrawalPromise
	};
};
