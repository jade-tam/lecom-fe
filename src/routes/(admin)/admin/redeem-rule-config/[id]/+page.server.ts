import { resolve } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { id } = params;

	redirect(307, resolve('/(admin)/admin/redeem-rule-config/[id]/update', { id }));
};
