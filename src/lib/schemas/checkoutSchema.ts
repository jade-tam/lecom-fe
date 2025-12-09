import { vnPrefixes } from '$lib/consts/vnPhonePrefixes';
import { z } from 'zod';

export const checkoutSchema = z.object({
	shipToName: z.string().min(2, 'Tên người nhận không được để trống').max(100, 'Quá dài'),
	shipToPhone: z
		.string()
		.trim()
		.refine((val) => /^0\d{9}$/.test(val), {
			message: 'Số điện thoại phải gồm 10 số và bắt đầu bằng số 0'
		})
		.refine((val) => vnPrefixes.some((p) => val.startsWith(p)), {
			message: 'Đầu số điện thoại không hợp lệ tại Việt Nam'
		}),
	shipToAddress: z
		.string()
		.min(8, 'Địa chỉ không được để trống, tối thiểu 8 ký tự')
		.max(100, 'Quá dài'),
	voucherCode: z.string().optional(),
	selectedProductIds: z
		.array(z.string().min(1, 'ID sản phẩm không được để trống'))
		.min(1, 'Chọn ít nhất một sản phẩm'),
	paymentMethod: z.string().min(2, 'Cần chọn một phương thức thanh toán'),
	note: z.string().max(500, 'Ghi chú quá dài').optional()
});

export type CheckoutSchema = z.infer<typeof checkoutSchema>;
