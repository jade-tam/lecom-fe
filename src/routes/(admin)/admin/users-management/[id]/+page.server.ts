import type { UserDetailAdmin } from '$lib/types/User.js';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';

export const load = async ({ cookies, params }) => {
	const { id } = params;

	const { responseBody } = await fetchAuthorizedApi<UserDetailAdmin>(
		cookies,
		`/api/admin/user/${id}`,
		'GET'
	);

	const user: UserDetailAdmin = responseBody.result;

	return {
		user
	};
};
