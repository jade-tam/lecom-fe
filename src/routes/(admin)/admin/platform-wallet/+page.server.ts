import type { PlatformWallet, PlatformWalletTransactions } from '$lib/types/PlatformWallet.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const platformWalletPromise: Promise<PlatformWallet | null> = getSafeResult(
		fetchAuthorizedApi<PlatformWallet>(cookies, '/api/Wallet/admin/platform-wallet', 'GET'),
		null
	);

	const walletTransactionsDataPromise: Promise<PlatformWalletTransactions | null> = getSafeResult(
		fetchAuthorizedApi<PlatformWalletTransactions>(
			cookies,
			`/api/Wallet/admin/platform-wallet/transactions?pageSize=99999999`,
			'GET'
		),
		null
	);

	return {
		platformWalletPromise,
		walletTransactionsDataPromise
	};
};
