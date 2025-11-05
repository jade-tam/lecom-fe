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

export const addCourseSectionSchema = z.object({
	title: z
		.string({ error: 'Course title is required' })
		.min(3, 'Title must be at least 3 characters long')
		.max(100, 'Title must not exceed 100 characters'),
	orderIndex: z.int()
});

export const addCourseLessonSchema = z.object({
	title: z
		.string({ error: 'Course title is required' })
		.min(3, 'Title must be at least 3 characters long')
		.max(100, 'Title must not exceed 100 characters'),
	type: z.string().default('Video'),
	durationSeconds: z.int(),
	contentUrl: z.url('Please upload your lesson video'),
	courseSectionId: z.string().min(1, 'Something wrong, missing current course section id'),
	orderIndex: z.int()
});

export const deleteCourseSectionSchema = z.object({
	sectionId: z.string().min(1, 'Something wrong, missing current course section id')
});

export const deleteCourseLessonSchema = z.object({
	lessonId: z.string().min(1, 'Something wrong, missing current course lesson id')
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;
export type AddCourseSectionSchema = z.infer<typeof addCourseSectionSchema>;
export type AddCourseLessonSchema = z.infer<typeof addCourseLessonSchema>;
export type DeleteCourseSectionSchema = z.infer<typeof deleteCourseSectionSchema>;
export type DeleteCourseLessonSchema = z.infer<typeof deleteCourseLessonSchema>;
