import { adminCreateBroadcastSchema } from '$lib/schemas/adminCreateBroadcastSchema.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(adminCreateBroadcastSchema));

	return {
		form
	};
};

export const actions = {
	createBroadcast: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(adminCreateBroadcastSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/notifications/broadcast`,
			'POST',
			formData
		);

		const toastData = getToastData(responseBody, 'Thông báo đã được gửi thành công');

		if (response.ok) {
			return message(form, { toastData });
		} else {
			return message(form, { toastData }, { status: 400 });
		}
	}
};
