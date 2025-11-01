import type { Category } from '$lib/types/Category';
import type { Course } from '$lib/types/Course';
import type { Product } from '$lib/types/Product';
import { fetchApi, getSafeResult } from '$lib/utils/externalApi';

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
