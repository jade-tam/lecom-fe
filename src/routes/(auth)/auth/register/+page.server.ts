import { registerSchema } from '$lib/schemas/registerSchema';
import { fetchApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(registerSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { confirmPassword, ...formData } = {
			...form.data,
			dateOfBirth: new Date(form.data.dateOfBirth).toISOString()
		};

		const { response, responseBody } = await fetchApi('/api/Auth/register', 'POST', formData);

		const responseToastData: ToastData = getToastData(responseBody, 'Đã gửi thông tin đăng ký');

		if (response.ok) {
			return message(form, responseToastData);
		} else {
			return message(form, responseToastData, { status: 400 });
		}
	}
};
