import { updateShopSchema } from '$lib/schemas/updateShopSchema.js';
import type { Shop } from '$lib/types/Shop.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast.js';
import type { Actions } from '@sveltejs/kit';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<Shop>(cookies, '/api/Seller/my-shop', 'GET');
	const shop = responseBody.result;
	const form = await superValidate(shop, zod4(updateShopSchema));

	return {
		form,
		shop: shop
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(updateShopSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, ...formData } = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/Seller/${id}`,
			'PUT',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Shop information has been updated');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
