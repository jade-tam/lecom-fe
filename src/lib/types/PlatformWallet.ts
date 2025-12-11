import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export type PlatformWallet = {
	id: string; // Platform wallet identifier
	balance: number; // Current balance
	totalCommissionEarned: number; // Total commission earned
	totalCommissionRefunded: number; // Total commission refunded
	totalPayout: number; // Total payout amount
	createdAt: string; // ISO date string
	lastUpdated: string; // ISO date string
};

export type PlatformWalletTransaction = {
  id: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  description: string;
  performedBy: string | null;
  referenceId: string;
  referenceType: PlatformWalletTransactionType;
  type: PlatformWalletTransactionType;
};


export type PlatformWalletTransactions = {
	totalItems: number;
	page: number;
	pageSize: number;
	totalPages: number;
	transactions: PlatformWalletTransaction[];
};

export const platformWalletTransactionTypeOptions = [
	{ title: 'Tiền hoa hồng', value: 'CommissionIncome' },
	{ title: 'Tiền hoàn trả', value: 'CommissionRefund' }
] as const satisfies readonly FormSelectOption[];

export type PlatformWalletTransactionType = (typeof platformWalletTransactionTypeOptions)[number]['value'];
