import { PUBLIC_API_URL } from '$env/static/public';

export const load = async () => {
	const res = await fetch(PUBLIC_API_URL + '/api/CourseCategory', {
		method: 'GET'
	});

	const responseData = await res.json();

	return {
		categories: responseData
	};
};
