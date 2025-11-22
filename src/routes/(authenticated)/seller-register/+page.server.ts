import { registerShopSchema } from '$lib/schemas/registerShopSchema';
import type { Category } from '$lib/types/Category';
import { fetchApi, fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const { responseBody } = await fetchApi<Category[]>('/api/CourseCategory', 'GET');
	const categories: Category[] = responseBody.result;
	const form = await superValidate(zod4(registerShopSchema));

	return { form, categories };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(registerShopSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			...form.data,
			ownerDateOfBirth: new Date(form.data.ownerDateOfBirth).toISOString()
		};

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/Seller/register',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Yêu cầu đăng ký của bạn đã được gửi. Chúng tôi sẽ kiểm tra và phản hồi lại trong vòng 48 giờ.'
		);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
