import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { haveAuthorization, parseJwt } from '$lib/utils/others';
import type { JwtPayload } from '$lib/types/JwtPayload';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleToken: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');

	if (token) {
		const payload: JwtPayload = parseJwt(token);

		console.log('[HandleToken Hook payload]: ', payload);

		event.locals.user = {
			id: payload.sub,
			email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
			name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
			role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
		};
	}

	return resolve(event);
};

const handleAuthGuard: Handle = async ({ event, resolve }) => {
	const routeId = event.route.id ?? '';
	const user = event.locals.user;

	if (routeId.startsWith('/(admin)')) {
		if (!user) {
			redirect(303, '/auth/login');
		}

		if (!haveAuthorization(user.role, 'Admin')) {
			redirect(303, '/unauthorized');
		}
	}

	if (routeId.startsWith('/(authenticated)')) {
		if (!user) {
			redirect(303, '/auth/login');
		}
	}

	if (routeId.startsWith('/(seller)')) {
		if (!user) {
			redirect(303, '/auth/login');
		}

		if (!haveAuthorization(user.role, 'Seller')) {
			redirect(303, '/unauthorized');
		}
	}

	if (routeId.startsWith('/(moderator)')) {
		if (!user) {
			redirect(303, '/auth/login');
		}

		if (!haveAuthorization(user.role, 'Moderator')) {
			redirect(303, '/unauthorized');
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleToken, handleAuthGuard);
