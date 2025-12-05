import { z } from 'zod';

export const createCommunityPostSchema = z.object({
	title: z.string().min(8, 'Tiêu đề phải có ít nhất 8 ký tự').max(100, 'Tiêu đề tối đa 100 ký tự'),
	body: z.string().min(1, 'Nội dung không được để trống').max(2000, 'Nội dung bài post quá dài')
});

export type CreateCommunityPostSchema = z.infer<typeof createCommunityPostSchema>;

export const createCommentSchema = z.object({
	postId: z.string().min(1, 'Post ID không tìm thấy'),
	body: z.string().min(1, 'Chưa nhập bình luận').max(100, 'Bình luận quá dài')
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
