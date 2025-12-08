import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course';
import type { Product } from '$lib/types/Product';
import { fetchApi, fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast';
import { fail } from '@sveltejs/kit';

type LandingPageData = {
	topCourseCategories: Category[];
	topProductCategories: Category[];
	popularCourses: Course[];
	bestSellerProducts: Product[];
};

export async function load() {
	const landingPageData = getSafeResult<LandingPageData>(
		fetchApi<LandingPageData>('/api/landing-page', 'GET'),
		{
			topCourseCategories: [],
			topProductCategories: [],
			popularCourses: [],
			bestSellerProducts: []
		}
	);

	return {
		landingPageData
	};
}

export const actions = {
	readNotificationById: async ({ request, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) return fail(400, 'No id');

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/notifications/${id}/read`,
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Đã đánh dấu đã đọc',
			'Không thể đánh dấu'
		);

		if (response.ok) {
			return { toastData };
		} else {
			return { toastData };
		}
	},

	readAllNotifications: async ({ cookies }) => {
		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/notifications/read-all`,
			'POST'
		);

		const toastData: ToastData = getToastData(
			responseBody,
			'Đã đánh dấu tất cả đã đọc',
			'Không thể đánh dấu'
		);

		if (response.ok) {
			return { toastData };
		} else {
			return { toastData };
		}
	}
};
