import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const refundReasonTypeOptions = [
	{ value: 'ProductIssue', title: 'Vấn đề liên quan đến sản phẩm' }
	// { value: 'Other', title: 'Vấn đề khác' }
] as const satisfies readonly FormSelectOption[];

export type RefundReasonType = (typeof refundReasonTypeOptions)[number]['value'];

export const refundStatusOptions = [
	{ value: 'PendingShop', title: 'Chờ cửa hàng' },
	{ value: 'PendingAdmin', title: 'Chờ quản trị viên' },
	{ value: 'Refunded', title: 'Đã hoàn tiền' }
] as const satisfies readonly FormSelectOption[];

export type RefundStatus = (typeof refundStatusOptions)[number]['value'];

export type Refund = {
	id: string;
	orderId: string;
	orderCode: string;
	requestedBy: string;
	requestedByName: string;
	requestedAt: string;
	reasonType: RefundReasonType;
	reasonDescription: string;
	type: 'Full';
	refundAmount: number;
	attachmentUrls: string;
	status: RefundStatus;
	shopResponseBy: string;
	shopResponseByName: string | null;
	shopRespondedAt: string | null;
	shopRejectReason: string | null;
	processedBy: string;
	processedByName: string | null;
	processedAt: string | null;
	processNote: string | null;
};
