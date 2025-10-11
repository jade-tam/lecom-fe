import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	cookies.delete('token', { path: '/' });
	cookies.delete('refreshToken', { path: '/' });

	throw redirect(302, '/auth/login');
};
