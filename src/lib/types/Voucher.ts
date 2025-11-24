import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const discountTypeOptions = [
	{
		title: 'Theo phần trăm',
		value: 'Percentage'
	},
	{
		title: 'Số tiền cố định',
		value: 'FixedAmount'
	}
] as const satisfies readonly FormSelectOption[];

export type DiscountType = (typeof discountTypeOptions)[number]['value'];

export type Voucher = {
	id: string;
	code: string;
	discountType: DiscountType;
	discountValue: number;
	maxDiscountAmount: number;
	minOrderAmount: number;
	usageLimitPerUser: number;
	quantityAvailable: number;
	startDate: string; // ISO date string
	endDate: string; // ISO date string
	isActive: boolean;
	userVouchers: any[]; // Replace 'any' with a specific type if you have user voucher details
};
