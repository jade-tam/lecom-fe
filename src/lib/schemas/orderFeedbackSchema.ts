import { z } from 'zod';

export const createProductFeedbackSchema = z.object({
	productId: z.string().min(1, 'Lỗi, Không tìm thấy mã sản phẩm.'),
	rating: z
		.number({ message: 'Vui lòng chọn số sao đánh giá.' })
		.int('Số sao phải là số nguyên.')
		.min(1, 'Đánh giá tối thiểu là 1 sao.')
		.max(5, 'Đánh giá tối đa là 5 sao.'),
	content: z.string().min(10, 'Vui lòng nhập nội dung đánh giá. Tối thiểu 10 ký tự.'),
	images: z.array(z.url('Đường dẫn hình ảnh không hợp lệ.'))
});

export type CreateProductFeedbackSchema = z.infer<typeof createProductFeedbackSchema>;
