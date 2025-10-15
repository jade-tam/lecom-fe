import { forgotPasswordSchema } from '$lib/schemas/forgotPasswordSchema';
import { fetchApi, getToastData } from '$lib/utils/externalApi';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(forgotPasswordSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(forgotPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchApi(
			'/api/Auth/forget-password',
			'POST',
			formData
		);

		const toastData = getToastData(responseBody);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
