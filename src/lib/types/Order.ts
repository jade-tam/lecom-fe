import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';
import type { PaymentMethod } from './OrderPaymentGroup';

export const orderStatusOptions = [
	{ value: 'Pending', title: 'Chờ thanh toán' },
	{ value: 'Paid', title: 'Chờ xác nhận' },
	{ value: 'Processing', title: 'Chờ đóng gói' },
	{ value: 'Shipping', title: 'Đang vận chuyển' },
	{ value: 'Completed', title: 'Đã hoàn thành' },
	{ value: 'Cancelled', title: 'Đơn đã huỷ' },
	{ value: 'Refunded', title: 'Đã hoàn tiền' }
	// { value: 'PaymentFailed', title: 'Thanh toán thất bại' }
] as const satisfies readonly FormSelectOption[];

export type OrderStatus = (typeof orderStatusOptions)[number]['value'];

export const paymentStatusOptions = [
	{ value: 'Pending', title: 'Chờ thanh toán' },
	{ value: 'Paid', title: 'Đã thanh toán' },
	{ value: 'Failed', title: 'Thanh toán thất bại' },
	// { value: 'PartiallyRefunded', title: 'Đã hoàn tiền một phần' },
	{ value: 'Refunded', title: 'Đã hoàn tiền' }
	// { value: 'Cancelled', title: 'Đã huỷ' }
] as const satisfies readonly FormSelectOption[];

export type PaymentStatus = (typeof paymentStatusOptions)[number]['value'];

// Add ShipmentStatus options and type
export const shipmentStatusOptions = [
	{ value: 'Ready', title: 'Chờ đóng gói' },
	{ value: 'InTransit', title: 'Đang vận chuyển' },
	{ value: 'Delivered', title: 'Đã giao' },
	{ value: 'Returned', title: 'Đã trả hàng' }
] as const satisfies readonly FormSelectOption[];

export type ShipmentStatus = (typeof shipmentStatusOptions)[number]['value'];

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
	estimatedDelivery: string;
	paymentMethod: PaymentMethod;
	shipmentStatus: ShipmentStatus; // <-- Added here
	balanceReleased: boolean;
	createdAt: string; // ISO 8601 timestamp
	completedAt: string | null;
	details: OrderDetail[];
}
