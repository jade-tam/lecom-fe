import { type Category } from '$lib/types/Category.js';
import { fetchAuthorizedApi } from '$lib/utils/externalApi';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<Category[]>(
		cookies,
		'/api/productcategory',
		'GET'
	);

	return {
		categories: responseBody.result
	};
};
