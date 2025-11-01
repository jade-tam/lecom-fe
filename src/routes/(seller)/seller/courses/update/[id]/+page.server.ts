import {
	updateCourseSchema
} from '$lib/schemas/courseSchema';
import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course.js';
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

	const form = await superValidate(course, zod4(updateCourseSchema));

	return { form, categories };
};

export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
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
	}
};
