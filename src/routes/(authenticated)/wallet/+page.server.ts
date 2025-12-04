import type { Balance } from '$lib/types/Balance.js';
import type { WalletTransaction } from '$lib/types/Wallet.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export type ShopWalletTransactionData = {
	walletId: string;
	shopId: number;
	shopName: string;
	availableBalance: number;
	pendingBalance: number;
	totalEarned: number;
	totalWithdrawn: number;
	totalRefunded: number;
	lastUpdated: string;
	transactions: WalletTransaction[];
	pagination: {
		currentPage: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
};

export const load = async ({ cookies }) => {
	const balancePromise: Promise<Balance | null> = getSafeResult(
		fetchAuthorizedApi<Balance>(cookies, '/api/Wallet/customer/balance', 'GET'),
		null
	);

	const walletTransactionsDataPromise: Promise<ShopWalletTransactionData | null> = getSafeResult(
		fetchAuthorizedApi<ShopWalletTransactionData>(
			cookies,
			`/api/Wallet/customer/transactions?pageSize=99999999`,
			'GET'
		),
		null
	);

	return {
		balancePromise,
		walletTransactionsDataPromise
	};
};
