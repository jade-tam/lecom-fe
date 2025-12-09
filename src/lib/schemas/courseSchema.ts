import { z } from 'zod';

export const createCourseSchema = z.object({
	title: z
		.string({ error: 'Tiêu đề là bắt buộc' })
		.min(3, 'Tiêu đề phải ít nhất 3 ký tự')
		.max(100, 'Tiêu đề không vượt quá 100 ký tự'),

	summary: z
		.string({ error: 'Tóm tắt là bắt buộc' })
		.min(10, 'Thông tin tóm tắt phải ít nhất 10 ký tự')
		.max(500, 'Thông tin tóm tắt không vượt quá 500 ký tự'),

	categoryId: z.string({ error: 'Chọn một danh mục' }),

	courseThumbnail: z.url('Cần tải lên ảnh đại diện khóa học')
});

export const updateCourseSchema = createCourseSchema.extend({
	active: z.any()
});

export const addCourseSectionSchema = z.object({
	title: z
		.string({ error: 'Cần nhập tiêu đề chương học' })
		.min(3, 'Tiêu đề chương học phải có ít nhất 3 ký tự')
		.max(100, 'Tiêu đề chương học không vượt quá 100 ký tự'),
	orderIndex: z.int()
});

export const addCourseLessonSchema = z.object({
	title: z
		.string({ error: 'Cần nhập tiêu đề bài học' })
		.min(3, 'Tiêu đề bài học phải có ít nhất 3 ký tự')
		.max(100, 'Tiêu đề bài học không vượt quá 100 ký tự'),
	type: z.string().default('Video'),
	durationSeconds: z.int(),
	contentUrl: z.url('Vui lòng tải lên video bài học'),
	courseSectionId: z.string().min(1, 'Có lỗi xảy ra, thiếu ID phần khóa học hiện tại'),
	orderIndex: z.int()
});

export const deleteCourseSectionSchema = z.object({
	sectionId: z.string().min(1, 'Có lỗi xảy ra, thiếu ID phần chương khóa học hiện tại')
});

export const deleteCourseLessonSchema = z.object({
	lessonId: z.string().min(1, 'Có lỗi xảy ra, thiếu ID bài học hiện tại')
});

export const linkProductSchema = z.object({
	lessonTitle: z.string().min(1, 'Có lỗi xảy ra, thiếu tiêu đề bài học'),
	productName: z.string().min(1, 'Bạn quên liên kết sản phẩm'),
	lessonId: z.string().min(1, 'Có lỗi xảy ra, thiếu ID bài học hiện tại'),
	productId: z.string().min(1, 'Vui lòng chọn một sản phẩm để liên kết')
});

export type CreateCourseSchema = z.infer<typeof createCourseSchema>;
export type UpdateCourseSchema = z.infer<typeof updateCourseSchema>;
export type AddCourseSectionSchema = z.infer<typeof addCourseSectionSchema>;
export type AddCourseLessonSchema = z.infer<typeof addCourseLessonSchema>;
export type DeleteCourseSectionSchema = z.infer<typeof deleteCourseSectionSchema>;
export type DeleteCourseLessonSchema = z.infer<typeof deleteCourseLessonSchema>;
export type LinkProductSchema = z.infer<typeof linkProductSchema>;
