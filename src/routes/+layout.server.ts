import type { UserProfile } from '$lib/types/UserProfile';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, depends, locals }) => {
	// make the layout depend on auth state
	depends('auth:session');

	if (cookies.get('token') === undefined) {
		return {
			userRole: null,
			userProfile: null,
			notificationsPromise: null,
			token: null
		};
	}

	const { responseBody } = await fetchAuthorizedApi<UserProfile>(
		cookies,
		'/api/user/profile',
		'GET'
	);

	const notificationsPromise = getSafeResult(
		fetchAuthorizedApi<Notification[]>(cookies, '/api/notifications', 'GET'),
		[]
	);

	// If request succeeded
	if (responseBody.isSuccess) {
		return {
			userRole: locals.user?.role,
			userProfile: responseBody.result,
			notificationsPromise: notificationsPromise,
			token: cookies.get('token')
		};
	}

	// If backend says unauthorized or some other error
	return {
		userRole: null,
		userProfile: null,
		notificationsPromise: null,
		token: null
	};
};
