import z from 'zod';

export const addToCartSchema = z.object({
	productId: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy ID sản phẩm'),
	quantity: z
		.number({
			error: 'Số lượng là bắt buộc'
		})
		.int('Số lượng phải là số nguyên')
		.min(1, 'Số lượng phải ít nhất 1')
});

export type AddToCartSchema = z.infer<typeof addToCartSchema>;

export const updateCartItemCountSchema = z.object({
	productId: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy ID sản phẩm'),
	quantityChange: z
		.number({
			error: 'quantityChange là bắt buộc'
		})
		.int('quantityChange phải là số nguyên')
});

export type UpdateCartItemCountSchema = z.infer<typeof updateCartItemCountSchema>;

export const deleteCartItemSchema = z.object({
	productId: z.string().min(1, 'Có lỗi xảy ra, không tìm thấy ID sản phẩm')
});

export type DeleteCartItemSchema = z.infer<typeof deleteCartItemSchema>;
