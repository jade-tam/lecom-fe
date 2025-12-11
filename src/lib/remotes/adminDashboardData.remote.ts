import { getRequestEvent, query } from '$app/server';
import type { AdminDashboardData } from '$lib/types/Dashboard';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';
import { z } from 'zod';

const getAdminDashboardParamsSchema = z.object({
	view: z.enum(['day', 'custom']),
	date: z.string().optional(),
	from: z.string(),
	to: z.string()
});

export const getAdminDashboardData = query(
	getAdminDashboardParamsSchema,
	async ({ view, date, from, to }) => {
		const { cookies } = getRequestEvent();

		// Build query string with only existing params
		const params = new URLSearchParams();
		params.append('view', view);
		if (date) params.append('date', date);
		params.append('from', from);
		params.append('to', to);

		const adminDashboardData = await getSafeResult(
			fetchAuthorizedApi<AdminDashboardData>(
				cookies,
				`/api/admin/dashboard?${params.toString()}`,
				'GET'
			),
			null
		);

		return adminDashboardData;
	}
);
