import { productStatusOptions } from '$lib/types/Product';
import { z } from 'zod';

export const productStatusEnum = z.enum(productStatusOptions.map((option) => option.value));

export const createProductSchema = z.object({
	name: z.string().min(1, 'Name cannot be empty'),
	categoryId: z.string().min(1, { error: 'Category ID is required' }),
	description: z.string().min(20, { error: 'Description is required atlest 20 characters' }),
	price: z.number({ error: 'Price is required' }).nonnegative('Price must be non-negative'),
	stock: z.number({ error: 'Stock is required' }).int().nonnegative('Stock must be non-negative'),
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
				.min(1, { error: 'Please upload at least one image.' })
		)
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
