import { PUBLIC_API_URL } from '$env/static/public';
import { registerSchema } from '$lib/schemas/registerSchema';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(registerSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, zod4(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword, ...formData } = {
			...form.data,
			dateOfBirth: new Date(form.data.dateOfBirth).toISOString()
		};

		const res = await fetch(PUBLIC_API_URL + '/api/Auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		const responseData = await res.json();

		const responseToastData: ToastData = {
			type: responseData.isSuccess ? 'success' : 'error',
			title: responseData.isSuccess ? 'Success' : 'Error',
			description: responseData.isSuccess
				? responseData.result.message
				: responseData.errorMessages.join('. ')
		};

		if (res.ok) {
			return message(form, responseToastData);
		} else {
			return message(form, responseToastData, { status: 400 });
		}
	}
};
