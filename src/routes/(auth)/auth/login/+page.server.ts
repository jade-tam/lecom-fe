import { PUBLIC_API_URL } from '$env/static/public';
import { loginSchema } from '$lib/schemas/loginSchema';
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

		const res = await fetch(PUBLIC_API_URL + '/api/Auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		const responseData = await res.json();

		const responseToastData: ToastData = {
			type: responseData.isSuccess ? 'success' : 'error',
			title: responseData.isSuccess ? 'Logged In' : null,
			description: responseData.isSuccess
				? responseData.result.message
				: responseData.errorMessages.join('. ')
		};

		if (res.ok) {
			storeTokens(cookies, responseData.result.token, responseData.result.refreshToken);

			return message(form, responseToastData);
		} else {
			return message(form, responseToastData, { status: 400 });
		}
	}
};
