import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';
import type { Order } from './Order';

export const paymentMethodOptions = [
	{
		title: 'Pay OS',
		value: 'payos'
	}
] as const satisfies readonly FormSelectOption[];

export type PaymentMethod = (typeof paymentMethodOptions)[number]['value'];

export type OrderCheckout = {
	orders: Order[];
	paymentUrl: string;
	totalAmount: number;
	paymentMethod: PaymentMethod;
	walletAmountUsed: number;
	payOSAmountRequired: number;
	discountApplied: number;
	shippingFee: number;
	voucherCodeUsed?: string | null;
};
