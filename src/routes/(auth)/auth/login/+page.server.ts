import { loginSchema } from '$lib/schemas/loginSchema';
import { fetchApi, getToastData } from '$lib/utils/externalApi';
import { storeTokens } from '$lib/utils/others';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(loginSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchApi('/api/Auth/login', 'POST', formData);

		const responseToastData: ToastData = getToastData(responseBody, 'Logged in');

		if (response.ok) {
			storeTokens(
				cookies,
				responseBody.result.token as string,
				responseBody.result.refreshToken as string
			);

			return message(form, responseToastData);
		} else {
			return message(form, responseToastData, { status: 400 });
		}
	}
};
