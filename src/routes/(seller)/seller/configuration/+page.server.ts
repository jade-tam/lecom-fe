import { getShopAddress } from '$lib/remotes/shopAddress.remote.js';
import { shopAddressSchema } from '$lib/schemas/shopAddressSchema';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const shopAddress = await getShopAddress();

	const shopAddressForm = await superValidate(shopAddress, zod4(shopAddressSchema));

	return {
		shopAddressForm
	};
};

export const actions = {
	createAddress: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(shopAddressSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/shop/address/me`,
			'POST',
			formData
		);

		const toastData = getToastData(
			responseBody,
			'Địa chỉ cửa hàng đã được thiết lập thành công.',
			'Không thể thiết lập địa chỉ cửa hàng.'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	},
	updateAddress: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(shopAddressSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { id, ...formData } = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/shop/address/me/${id}`,
			'PUT',
			formData
		);

		const toastData = getToastData(
			responseBody,
			'Địa chỉ cửa hàng đã được cập nhật thành công.',
			'Không thể cập nhật địa chỉ cửa hàng.'
		);

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
