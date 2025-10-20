import z from 'zod';

export const addCategorySchema = z.object({
	name: z.string().trim().min(3, { message: 'Atleast 3 characters' }),
	description: z.string().trim().min(5, { message: 'Atleast 5 characters' })
});

export type AddCategorySchema = z.infer<typeof addCategorySchema>;
