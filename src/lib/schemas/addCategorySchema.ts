import z from 'zod';

export const addCategorySchema = z.object({
	name: z.string().trim().min(3, { message: 'Tối thiểu 3 ký tự' }),
	description: z.string().trim().min(5, { message: 'Tối thiểu 5 ký tự' })
});

export type AddCategorySchema = z.infer<typeof addCategorySchema>;
