import type { Enrollment } from '$lib/types/Enrollment.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export async function load({ cookies }) {
	const enrollments: Enrollment[] = await getSafeResult(
		fetchAuthorizedApi<Enrollment[]>(cookies, '/api/courses/my-enrollments', 'GET'),
		[] as Enrollment[]
	);

	return {
		enrollments
	};
}
