import {
	addCourseLessonSchema,
	addCourseSectionSchema,
	deleteCourseLessonSchema,
	deleteCourseSectionSchema,
	updateCourseSchema
} from '$lib/schemas/courseSchema';
import type { Category } from '$lib/types/Category';
import type { Course, Section } from '$lib/types/Course.js';
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
	const addLessonForm = await superValidate(zod4(addCourseLessonSchema));
	const deleteSectionForm = await superValidate(zod4(deleteCourseSectionSchema));
	const deleteLessonForm = await superValidate(zod4(deleteCourseLessonSchema));

	return {
		form,
		categories,
		sections,
		addSectionForm,
		addLessonForm,
		deleteSectionForm,
		deleteLessonForm
	};
};

export const actions: Actions = {
	updateCourse: async ({ request, cookies, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(updateCourseSchema));

		console.log(form);

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

		const toastData: ToastData = getToastData(responseBody, 'Course has been updated');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	addSection: async ({ request, cookies, params }) => {
		const { id } = params;
		const form = await superValidate(request, zod4(addCourseSectionSchema));

		console.log(form);

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

		const toastData: ToastData = getToastData(responseBody, 'Section added');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	addLesson: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(addCourseLessonSchema));

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/seller/courses/lessons',
			'POST',
			{
				courseSectionId: formData.courseSectionId,
				title: formData.title,
				type: formData.type,
				durationSeconds: formData.durationSeconds,
				contentUrl: formData.contentUrl,
				orderIndex: formData.orderIndex
			}
		);

		const toastData: ToastData = getToastData(responseBody, 'Lesson added');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
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

		const toastData: ToastData = getToastData(responseBody, 'Section deleted');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	deleteLesson: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(deleteCourseLessonSchema));

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/courses/lessons/${formData.lessonId}`,
			'DELETE'
		);

		const toastData: ToastData = getToastData(responseBody, 'Lesson deleted');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
