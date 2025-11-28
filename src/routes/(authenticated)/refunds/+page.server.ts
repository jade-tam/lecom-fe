import type { Refund } from '$lib/types/Refund.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = ({ cookies }) => {
	const refundsPromise = getSafeResult(
		fetchAuthorizedApi<Refund[]>(cookies, '/api/Refund/my', 'GET'),
		[] as Refund[]
	);

	return {
		refundsPromise
	};
};
