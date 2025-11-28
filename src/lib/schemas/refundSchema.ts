import { refundReasonTypeOptions } from '$lib/types/Refund';
import { z } from 'zod';

export const createRefundSchema = z.object({
	orderId: z.string().min(1, 'Lỗi, Không tìm thấy mã đơn hàng.'),
	reasonType: z.enum(refundReasonTypeOptions.map((option) => option.value)).default('ProductIssue'), // Add more types if needed
	reasonDescription: z.string().min(10, 'Vui lòng nhập lý do. Tối thiểu 10 ký tự.'),
	type: z.enum(['Full']).default('Full'),
	refundAmount: z.number().min(0, 'Số tiền hoàn phải lớn hơn hoặc bằng 0.').default(0),
	attachmentUrls: z
		.string('Cần có video hoặc hình ảnh minh chứng.')
		.min(1, 'Cần có video hoặc hình ảnh minh chứng.')
});

export type CreateRefundSchema = z.infer<typeof createRefundSchema>;

export const reviewRefundSchema = z
	.object({
		refundId: z.string().min(1, 'Lỗi, Không tìm thấy mã refund.'),
		approve: z.boolean(),
		rejectReason: z.string().optional()
	})
	.superRefine((data, ctx) => {
		if (data.approve === false) {
			if (!data.rejectReason || data.rejectReason.length < 10) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Vui lòng nhập lý do từ chối. Tối thiểu 10 ký tự.',
					path: ['rejectReason']
				});
			}
		}
	});

export type ReviewRefundSchema = z.infer<typeof reviewRefundSchema>;
