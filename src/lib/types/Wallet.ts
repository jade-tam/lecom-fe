import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export type ShopWallet = {
	shopId: number;
	shopName: string;
	availableBalance: number;
	pendingBalance: number;
	totalEarned: number;
	totalWithdrawn: number;
	totalRefunded: number;
	pendingOrdersCount: number;
	pendingWithdrawalAmount: number;
	approvedWithdrawalAmount: number;
	lastUpdated: string;
};

export const walletTransactionTypeOptions = [
	{ title: 'Doanh thu đơn hàng', value: 'OrderRevenue' },
	{ title: 'Phí nền tảng', value: 'PlatformFee' },
	{ title: 'Rút tiền', value: 'Withdrawal' },
	{ title: 'Hoàn tiền', value: 'Refund' },
	{ title: 'Điều chỉnh', value: 'Adjustment' },
	{ title: 'Thanh toán', value: 'Payment' },
	{ title: 'Giải phóng số dư', value: 'BalanceRelease' }
] as const satisfies readonly FormSelectOption[];

export type WalletTransactionType = (typeof walletTransactionTypeOptions)[number]['value'];

export const walletTransactionBalanceTypeOptions = [
	{ title: 'Tạm giữ', value: 'Pending' },
	{ title: 'Khả dụng', value: 'Available' }
] as const satisfies readonly FormSelectOption[];

export type WalletTransactionBalanceType =
	(typeof walletTransactionBalanceTypeOptions)[number]['value'];

export type WalletTransaction = {
	id: string;
	amount: number;
	balanceBefore: number;
	balanceAfter: number;
	balanceType: WalletTransactionBalanceType;
	createdAt: string;
	description: string;
	performedBy: string | null;
	referenceId: string;
	referenceType: WalletTransactionType;
	type: WalletTransactionType;
};
