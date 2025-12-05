import type { DashboardViewType, SellerDashboardData } from '$lib/types/Dashboard.js';
import { toDateISO } from '$lib/utils/converters.js';
import { fetchAuthorizedApi, getSafeResult } from '$lib/utils/externalApi';

export const load = async ({ url, cookies }) => {
	const params = new URLSearchParams();

	const view: DashboardViewType = url.searchParams.get('view')
		? url.searchParams.get('view')
		: 'custom';
	const date = view === 'day' ? url.searchParams.get('date') : null;

	let from = view === 'custom' ? url.searchParams.get('from') : null;
	let to = view === 'custom' ? url.searchParams.get('to') : null;

	// Set default from/to to start/end of current month if not provided
	if (view === 'custom') {
		const now = new Date();
		if (!from || !to) {
			const start = new Date(now.getFullYear(), now.getMonth(), 1);
			from = toDateISO(start);

			const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
			to = toDateISO(end);
		}
	}

	if (view) params.set('view', view);
	if (date) params.set('date', date);
	if (from) params.set('from', from);
	if (to) params.set('to', to);

	const dashboardDataPromise: Promise<SellerDashboardData | null> = getSafeResult(
		fetchAuthorizedApi<SellerDashboardData>(
			cookies,
			`/api/seller/dashboard?${params.toString()}`,
			'GET'
		),
		null
	);

	return {
		dashboardDataPromise
	};
};
