import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const withdrawalStatusOptions = [
	{
		title: 'Đang chờ xử lý',
		value: 'Pending'
	},
	{
		title: 'Đã được chấp nhận',
		value: 'Approved'
	},
	{
		title: 'Đã bị huỷ',
		value: 'Rejected'
	},
	{
		title: 'Đã rút thành công',
		value: 'Completed'
	}
] as const satisfies readonly FormSelectOption[];

export type WithdrawalStatus = (typeof withdrawalStatusOptions)[number]['value'];

export type Withdrawal = {
	id: string;
	amount: number;
	bankName: string;
	bankAccountNumber: string;
	bankAccountName: string;
	status: WithdrawalStatus;
	requestedAt: string;
	approvedAt: string | null;
	completedAt: string | null;
	rejectionReason: string | null;
	note: string | null;
	adminNote: string | null;
};

export type WithdrawalDetail = {
	id: string;
	amount: number;
	status: WithdrawalStatus;
	requestedAt: string;
	approvedAt: string | null;
	completedAt: string | null;
	rejectionReason: string | null;
	note: string | null;
	adminNote: string | null;
	bank: {
		bankName: string;
		bankAccountNumber: string;
		bankAccountName: string;
		bankBranch: string;
	};
	shop: {
		shopId: number;
		shopName: string;
		shopAvatar: string;
	};
};
