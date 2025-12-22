import {
	courseLessonSchema,
	addCourseSectionSchema,
	deleteCourseLessonSchema,
	deleteCourseSectionSchema,
	linkProductSchema,
	updateCourseSchema
} from '$lib/schemas/courseSchema';
import type { Category } from '$lib/types/Category';
import type { Course, Section } from '$lib/types/Course.js';
import type { Product } from '$lib/types/Product.js';
import { fetchApi, fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies, params }) => {
	const { id } = params;
	const categories = getSafeResult(
		fetchApi<Category[]>('/api/CourseCategory', 'GET'),
		[] as Category[]
	);
	const products = getSafeResult(
		fetchAuthorizedApi<Product[]>(cookies, '/api/seller/products', 'GET'),
		[] as Product[]
	);

	const { responseBody: courseResponseBody } = await fetchAuthorizedApi<Course>(
		cookies,
		`/api/seller/courses/${id}`,
		'GET'
	);
	const course = courseResponseBody.result;

	const sections = getSafeResult(
		fetchAuthorizedApi<Section[]>(cookies, `/api/seller/courses/${id}/sections`, 'GET'),
		[] as Section[]
	);

	const form = await superValidate(course, zod4(updateCourseSchema));
	const addSectionForm = await superValidate(zod4(addCourseSectionSchema));
	const addLessonForm = await superValidate(zod4(courseLessonSchema));
	const deleteSectionForm = await superValidate(zod4(deleteCourseSectionSchema));
	const deleteLessonForm = await superValidate(zod4(deleteCourseLessonSchema));
	const linkProductForm = await superValidate(zod4(linkProductSchema));
	const unlinkProductForm = await superValidate(zod4(linkProductSchema));

	return {
		form,
		categories,
		products,
		sections,
		addSectionForm,
		addLessonForm,
		deleteSectionForm,
		deleteLessonForm,
		linkProductForm,
		unlinkProductForm
	};
};

export const actions: Actions = {
	updateCourse: async ({ request, cookies, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(updateCourseSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/${id}`,
			'PUT',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Thông tin khoá học đã được cập nhật');

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	},

	addSection: async ({ request, cookies, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(addCourseSectionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/seller/courses/sections',
			'POST',
			{
				courseId: id,
				title: formData.title,
				orderIndex: formData.orderIndex
			}
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Chương học đã được thêm',
			'Không thể thêm chương học'
		);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	createCourseLesson: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(courseLessonSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/seller/courses/lessons',
			'POST',
			formData
		);

		console.log('CREATE LESSON WITH DATA', formData);
		console.log('CREATE LESSON WITH DATA quiz', formData.quiz);

		const toastData: ToastData = getToastData(
			responseBody,
			'Bài học đã được thêm',
			'Không thể thêm bài học'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	},

	updateCourseLesson: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(courseLessonSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/lessons/${formData.courseLessonId}`,
			'PUT',
			formData
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Bài học đã được thêm',
			'Không thể thêm bài học'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	},

	deleteSection: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(deleteCourseSectionSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/sections/${formData.sectionId}`,
			'DELETE'
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Chương đã được xoá',
			'Không thể xoá chương học'
		);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	deleteLesson: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(deleteCourseLessonSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/lessons/${formData.lessonId}`,
			'DELETE'
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Bài học đã được xoá',
			'Không thể xoá bài học'
		);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	linkProduct: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(linkProductSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/lessons/products`,
			'POST',
			{
				lessonId: formData.lessonId,
				productId: formData.productId
			}
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Sản phẩm đã được liên kết với bài học',
			'Không thể liên kết sản phẩm với bài học'
		);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	unlinkProduct: async ({ request, cookies }) => {
		const data = await request.formData();
		const productId = data.get('productId');
		const lessonId = data.get('lessonId');

		if (!productId || !lessonId) return fail(400, { message: 'Missing required data' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/lessons/${lessonId}/products/${productId}`,
			'DELETE'
		);

		const toastData = getToastData(
			responseBody,
			'Sản phẩm đã được gỡ liên kết khỏi bài học',
			'Không thể gỡ liên kết sản phẩm'
		);

		return { toastData };
	}
};
