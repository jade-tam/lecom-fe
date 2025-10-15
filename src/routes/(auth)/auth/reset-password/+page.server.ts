import { resetPasswordSchema, type ResetPasswordSchema } from '$lib/schemas/resetPasswordSchema.js';
import { fetchApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ url }) => {
	const email = url.searchParams.get('email') ?? '';
	const rawToken = url.searchParams.get('token') ?? '';
	const token = rawToken.replace(/ /g, '+');

	const form = await superValidate<ResetPasswordSchema, ToastData>(
		{
			email: email,
			token: token,
			newPassword: ''
		},
		zod4(resetPasswordSchema),
		{ errors: false } // Prevent errors show up at initial load
	);

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(resetPasswordSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword, ...formData } = form.data;

		const { response, responseBody } = await fetchApi('/api/Auth/reset-password', 'POST', formData);

		const toastData = getToastData(responseBody);

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
