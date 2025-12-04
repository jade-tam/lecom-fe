import type { AdminCustomerWithdrawal } from '$lib/types/Withdrawal.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';
import { log } from 'console';

export const load = async ({ cookies }) => {
	const customerWithdrawalsPromise: Promise<AdminCustomerWithdrawal[]> = getSafeResult(
		fetchAuthorizedApi(cookies, '/api/Withdrawal/admin/customer/pending', 'GET'),
		[] as AdminCustomerWithdrawal[]
	);
	const data = await customerWithdrawalsPromise;

	log(data);
	return {
		customerWithdrawalsPromise
	};
};
