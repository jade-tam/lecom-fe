import { createProductSchema } from '$lib/schemas/createProductSchema';
import type { Category } from '$lib/types/Category';
import type { Product } from '$lib/types/Product.js';
import { fetchApi, fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ params, cookies }) => {
	const { id } = params;

	const product: Product = (
		await fetchAuthorizedApi<Product>(cookies, `/api/seller/products/${id}`, 'GET')
	).responseBody.result;

	const categories: Category[] = (await fetchApi<Category[]>('/api/productcategory', 'GET'))
		.responseBody.result;

	const form = await superValidate(product, zod4(createProductSchema));

	return { form, categories };
};

export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
		const { id } = params;

		const form = await superValidate(request, zod4(createProductSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/seller/products/${id}`,
			'PUT',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Product has been updated');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
