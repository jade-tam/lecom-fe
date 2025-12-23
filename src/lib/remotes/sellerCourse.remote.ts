import { getRequestEvent, query } from '$app/server';
import type { ModeratorPendingLessonDetail } from '$lib/types/Course';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';
import z from 'zod';

export const getLessonDetailForModerator = query(z.string(), async (id) => {
	const { cookies } = getRequestEvent();

	const lesson = await getSafeResult(
		fetchAuthorizedApi<ModeratorPendingLessonDetail>(
			cookies,
			`/api/moderator/lessons/${id}`,
			'GET'
		),
		null
	);

	return lesson;
});
