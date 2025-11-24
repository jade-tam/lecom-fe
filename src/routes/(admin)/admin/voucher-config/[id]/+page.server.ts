import type { Voucher } from '$lib/types/Voucher.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const voucherPromise = getSafeResult(
		fetchAuthorizedApi<Voucher>(cookies, `/api/admin/vouchers/${id}`, 'GET'),
		null
	);
	return {
		voucherPromise
	};
};
