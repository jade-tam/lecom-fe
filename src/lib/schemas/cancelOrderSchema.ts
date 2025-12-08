import { z } from 'zod';

export const cancelOrderSchema = z.object({
	cancelReason: z.string().min(10, 'Vui lòng nhập lý do hủy đơn hàng. Tối thiểu 10 ký tự.')
});

export type CancelOrderSchema = z.infer<typeof cancelOrderSchema>;
