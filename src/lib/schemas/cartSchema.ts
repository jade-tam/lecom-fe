import z from 'zod';

export const addToCartSchema = z.object({
	productId: z.string().min(1, 'Something wrong, no product id'),
	quantity: z
		.number({
			error: 'Quantity is required'
		})
		.int('Quantity must be an integer')
		.min(1, 'Quantity must be at least 1')
});

export type AddToCartSchema = z.infer<typeof addToCartSchema>;
