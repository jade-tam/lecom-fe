import { updateUserProfileSchema } from '$lib/schemas/updateUserProfileSchema.js';
import type { UserProfile } from '$lib/types/UserProfile';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast.js';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<UserProfile>(
		cookies,
		'/api/user/profile',
		'GET'
	);
	const userProfile: UserProfile = responseBody.result;

	const form = await superValidate(
		{
			...userProfile,
			dateOfBirth: userProfile.dateOfBirth?.split('T')[0]
		},
		zod4(updateUserProfileSchema)
	);

	return { form };
};

export const actions: Actions = {
	updateProfile: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(updateUserProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = {
			...form.data,
			ownerDateOfBirth: new Date(form.data.dateOfBirth).toISOString()
		};

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/user/profile',
			'PUT',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Your profile has been updated');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	},

	// ====================================================================
	updatePassword: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(updateUserProfileSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/user/change-password',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Your password has been updated');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
