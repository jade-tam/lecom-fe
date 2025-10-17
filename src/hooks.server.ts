import { redirect, type Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';
import { parseJwt } from '$lib/utils/others';

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
		event.locals.user = parseJwt(token);
	}

	return resolve(event);
};

const handleAuthGuard: Handle = async ({ event, resolve }) => {
	const routeId = event.route.id ?? '';

	if (routeId.startsWith('/(admin)') && !event.locals.user) {
		redirect(303, '/auth/login');
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleToken, handleAuthGuard);
