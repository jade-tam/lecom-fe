import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

export const checkoutSchema = z.object({
	shipToName: z.string().min(2, 'Recipient name is required').max(100, 'Too long'),
	shipToPhone: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Phone number must be 10 digits and start with 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Invalid Vietnam phone number prefix'
		}),
	shipToAddress: z
		.string()
		.min(8, 'Address is required, atleast 8 characters')
		.max(100, 'Too long'),
	voucherCode: z.string().optional(),
	selectedProductIds: z
		.array(z.string().min(1, 'Product ID is required'))
		.min(1, 'Select at least one product'),
	paymentMethod: z.string().min(2, 'Payment method is required'),
	walletAmountToUse: z
		.number()
		.min(0, 'Wallet amount must be zero or positive')
		.nullable()
		.default(null),
	note: z.string().max(500, 'Note is too long').optional()
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
