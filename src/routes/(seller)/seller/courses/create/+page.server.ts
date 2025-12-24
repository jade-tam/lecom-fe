import { createCourseSchema } from '$lib/schemas/courseSchema';
import type { Category } from '$lib/types/Category';
import { fetchApi, fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const categories = getSafeResult(
		fetchApi<Category[]>('/api/CourseCategory', 'GET'),
		[] as Category[]
	);
	const form = await superValidate(zod4(createCourseSchema));

	return { form, categories };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(createCourseSchema));

		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/seller/courses',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Khoá học đã được tạo, hãy bắt đầu thêm nội dung cho khoá học!'
		);

		if (response.ok) {
			return message(form, {
				toastData: toastData,
				responseResult: responseBody.result
			});
		} else {
			return message(
				form,
				{
					toastData: toastData,
					responseResult: responseBody.result
				},
				{ status: 400 }
			);
		}
	}
};
