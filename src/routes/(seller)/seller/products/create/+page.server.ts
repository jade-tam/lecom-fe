import { createProductSchema } from '$lib/schemas/createProductSchema';
import type { Category } from '$lib/types/Category';
import { fetchApi, fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const { responseBody } = await fetchApi<Category[]>('/api/productcategory', 'GET');
	const categories: Category[] = responseBody.result;
	const form = await superValidate(zod4(createProductSchema));

	return { form, categories };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(createProductSchema));

		console.log(form);
		console.log(form.errors.images);


		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/seller/products',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Product has been created');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
