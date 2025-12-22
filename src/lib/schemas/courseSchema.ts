import { z } from 'zod';
import { courseTypeOptions } from '$lib/types/Course';

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

export const courseLessonSchema = z
	.object({
		courseSectionId: z.string().min(1, 'Có lỗi xảy ra, thiếu ID phần khóa học hiện tại'),
		courseLessonId: z.string().optional(),
		title: z
			.string({ error: 'Cần nhập tiêu đề bài học' })
			.min(3, 'Tiêu đề bài học phải có ít nhất 3 ký tự')
			.max(100, 'Tiêu đề bài học không vượt quá 100 ký tự'),
		type: z.enum(courseTypeOptions.map((opt) => opt.value)).default(courseTypeOptions[0].value),
		durationSeconds: z.number().int().min(0, 'Thời lượng phải là số không âm'),
		contentUrl: z.string().url('Vui lòng tải lên video bài học').nullable(),
		orderIndex: z.number().int().min(0, 'Thứ tự bài học phải là số không âm'),
		quiz: z
			.object({
				questions: z
					.array(
						z.object({
							content: z.string().min(1, 'Nội dung câu hỏi là bắt buộc'),
							answers: z
								.array(
									z.object({
										content: z.string().min(1, 'Nội dung đáp án là bắt buộc'),
										isCorrect: z.boolean()
									})
								)
								.min(1, 'Phải có ít nhất một đáp án')
						})
					)
					.min(1, 'Phải có ít nhất một câu hỏi')
			})
			.nullable()
	})
	.superRefine((data, ctx) => {
		if (data.type === 'Video') {
			if (!data.contentUrl) {
				ctx.addIssue({
					path: ['contentUrl'],
					code: 'custom',
					message: 'Vui lòng tải lên video bài học'
				});
			}
			// quiz can be optional for video
		}
		if (data.type === 'Quiz') {
			if (!data.quiz) {
				ctx.addIssue({
					path: ['quiz'],
					code: 'custom',
					message: 'Cần thêm nội dung bài quiz'
				});
			} else {
				data.quiz.questions?.forEach((q, qIdx) => {
					if (!q.answers.some((a) => a.isCorrect)) {
						ctx.addIssue({
							path: ['quiz', 'questions', qIdx, 'answers'],
							code: 'custom',
							message: 'Mỗi câu hỏi phải có ít nhất một đáp án đúng'
						});
					}
				});
			}
			// contentUrl can be optional for quiz
		}
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
export type courseLessonSchema = z.infer<typeof courseLessonSchema>;
export type DeleteCourseSectionSchema = z.infer<typeof deleteCourseSectionSchema>;
export type DeleteCourseLessonSchema = z.infer<typeof deleteCourseLessonSchema>;
export type LinkProductSchema = z.infer<typeof linkProductSchema>;
