import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	console.log('Logged out');

	throw redirect(303, '/login');
};
