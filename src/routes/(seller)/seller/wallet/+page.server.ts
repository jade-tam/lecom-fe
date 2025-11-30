import type { ShopWallet, WalletTransaction } from '$lib/types/Wallet.js';
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
	const walletSummaryPromise: Promise<ShopWallet | null> = getSafeResult(
		fetchAuthorizedApi<ShopWallet>(cookies, '/api/Wallet/shop/summary', 'GET'),
		null
	);

	const walletTransactionsDataPromise: Promise<ShopWalletTransactionData | null> = getSafeResult(
		fetchAuthorizedApi<ShopWalletTransactionData>(
			cookies,
			`/api/Wallet/shop/transactions?pageSize=999999`,
			'GET'
		),
		null
	);

	return {
		walletSummaryPromise,
		walletTransactionsDataPromise
	};
};
