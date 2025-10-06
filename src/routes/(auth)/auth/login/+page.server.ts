import { loginSchema } from '$lib/schemas/loginSchema';
import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async () => {
	const form = await superValidate(zod4(loginSchema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod4(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// const response = await signInUser(locals.supabase, form.data);

		// const returnBody = await response.json();

		// if (!response.ok) {
		// 	return message(form, {
		// 		type: 'error',
		// 		text: returnBody.message
		// 	});
		// }

		// return message(form, {
		// 	type: 'success',
		// 	text: returnBody.message
		// });

		return message(form, {
			type: 'success',
			text: 'Logged in'
		});
	}
};
