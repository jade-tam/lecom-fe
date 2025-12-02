import type { UserProfile } from '$lib/types/UserProfile';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, depends, locals }) => {
	// make the layout depend on auth state
	depends('auth:session');

	if (cookies.get('token') === undefined) {
		return {
			userRole: null,
			userProfile: null
		};
	}

	const { responseBody } = await fetchAuthorizedApi<UserProfile>(
		cookies,
		'/api/user/profile',
		'GET'
	);

	// If request succeeded
	if (responseBody.isSuccess) {
		return {
			userRole: locals.user?.role,
			userProfile: responseBody.result
		};
	}

	// If backend says unauthorized or some other error
	return {
		userRole: null,
		userProfile: null
	};
};
