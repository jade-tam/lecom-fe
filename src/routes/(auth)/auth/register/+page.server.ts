import { registerSchema } from '$lib/schemas/registerSchema';
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

		// if (!response.ok) {
		// 	return message(
		// 		form,
		// 		{
		// 			type: 'error',
		// 			text: returnBody.message
		// 		},
		// 		{
		// 			status: response.status
		// 		}
		// 	);
		// }

		// return message(form, {
		// 	type: 'success',
		// 	text: returnBody.message
		// });

		return message(form, {
			type: 'success',
			text: 'Register success'
		});
	}
};
