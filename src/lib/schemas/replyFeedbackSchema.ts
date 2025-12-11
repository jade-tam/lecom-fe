import { z } from 'zod';

export const replyFeedbackSchema = z.object({
	feedbackId: z.string().min(1, 'Lỗi, Không tìm thấy mã đánh giá.'),
	type: z.enum(['update', 'create']),
	replyContent: z.string().min(5, 'Nội dung phản hồi phải có ít nhất 5 ký tự.')
});

export type ReplyFeedbackSchema = z.infer<typeof replyFeedbackSchema>;
