import { productStatusOptions } from '$lib/types/Product';
import { z } from 'zod';

export const productStatusEnum = z.enum(productStatusOptions.map((option) => option.value));

export const createProductSchema = z.object({
	name: z.string().min(1, 'Tên sản phẩm không được để trống'),
	categoryId: z.string().min(1, { error: 'ID danh mục là bắt buộc' }),
	description: z.string().min(20, { error: 'Mô tả là bắt buộc, tối thiểu 20 ký tự' }),
	price: z.number({ error: 'Giá là bắt buộc' }).nonnegative('Giá phải không âm'),
	stock: z
		.number({ error: 'Tồn kho là bắt buộc' })
		.int()
		.nonnegative('Số lượng tồn kho phải không âm'),
	status: productStatusEnum.default('Draft'),
	images: z
		.union([
			z.string().transform((val) => {
				try {
					return JSON.parse(val);
				} catch {
					return [];
				}
			}),
			z.array(z.any())
		])
		.pipe(
			z
				.array(
					z.object({
						url: z.url(),
						orderIndex: z.number().int().nonnegative(),
						isPrimary: z.boolean()
					})
				)
				.min(1, { error: 'Vui lòng tải lên ít nhất một ảnh.' })
		)
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
