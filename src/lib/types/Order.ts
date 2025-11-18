import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const orderStatusOptions = [
	{ value: 'Pending', title: 'Chờ xử lý' },
	{ value: 'Paid', title: 'Đã thanh toán' },
	{ value: 'Packed', title: 'Đã đóng gói' },
	{ value: 'Shipped', title: 'Đã giao hàng' },
	{ value: 'Completed', title: 'Hoàn thành' },
	{ value: 'Canceled', title: 'Đã hủy' }
] as const satisfies readonly FormSelectOption[];

export type OrderStatus = (typeof orderStatusOptions)[number]['value'];

export const paymentStatusOptions = [
	{ value: 'Pending', title: 'Chờ xử lý' },
	{ value: 'Succeeded', title: 'Thành công' },
	{ value: 'Failed', title: 'Thất bại' },
	{ value: 'Refunded', title: 'Đã hoàn tiền' },
	{ value: 'PartiallyRefunded', title: 'Hoàn tiền một phần' }
] as const satisfies readonly FormSelectOption[];

export type PaymentStatus = (typeof paymentStatusOptions)[number]['value'];

export interface OrderDetail {
	id: string | null;
	productId: string;
	productName: string;
	productImage: string | null;
	quantity: number;
	unitPrice: number;
	lineTotal: number;
	productSku: string | null;
	productCategory: string | null;
}

export interface Order {
	id: string;
	orderCode: string;
	userId: string;
	shopId: number;
	shopName: string;
	customerName: string | null;
	shipToName: string;
	shipToPhone: string;
	shipToAddress: string;
	subtotal: number;
	shippingFee: number;
	discount: number;
	total: number;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	balanceReleased: boolean;
	createdAt: string; // ISO 8601 timestamp
	completedAt: string | null;
	details: OrderDetail[];
}
