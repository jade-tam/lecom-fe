import type { UserProfile } from '$lib/types/UserProfile';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, depends, locals }) => {
	// make the layout depend on auth state
	depends('auth:session');

	try {
		// Call the authorized API (auto refresh + retry if needed)
		const { responseBody } = await fetchAuthorizedApi<UserProfile>(
			cookies,
			'/api/user/profile',
			'GET'
		);

		// If request succeeded
		if (responseBody.isSuccess) {
			return {
				userRole: locals.user?.role,
				userProfile: responseBody.result,
				isAuthenticated: true
			};
		}

		// If backend says unauthorized or some other error
		return {
			userRole: null,
			userProfile: null,
			isAuthenticated: false
		};
	} catch (err) {
		console.error('Auth check failed:', err);

		// When refresh token expired or fetch fails
		return {
			userRole: null,
			userProfile: null,
			isAuthenticated: false
		};
	}
};
