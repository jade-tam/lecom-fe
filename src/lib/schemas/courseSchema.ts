import { z } from 'zod';

export const createCourseSchema = z.object({
	title: z
		.string({ error: 'Title is required' })
		.min(3, 'Title must be at least 3 characters long')
		.max(100, 'Title must not exceed 100 characters'),

	summary: z
		.string({ error: 'Summary is required' })
		.min(10, 'Summary must be at least 10 characters long')
		.max(500, 'Summary must not exceed 500 characters'),

	categoryId: z.string({ error: 'Category is required' }),

	courseThumbnail: z.url('Course thumbnail is required')
});

export const updateCourseSchema = createCourseSchema.extend({
	active: z.any()
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;
