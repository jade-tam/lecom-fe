import type { User } from '$lib/types/User.js';
import { fetchAuthorizedApi, getToastData } from '$lib/utils/externalApi';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const { responseBody } = await fetchAuthorizedApi<User[]>(cookies, '/api/admin/user/all', 'GET');

	return {
		users: responseBody.result
	};
};

export const actions = {
	activate: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/user/activate/${id}`,
			'PUT'
		);

		const toastData = getToastData(responseBody, 'Người dùng đã được kích hoạt');

		return { toastData };
	},

	deactivate: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(
			cookies,
			`/api/admin/user/deactivate/${id}`,
			'PUT'
		);

		const toastData = getToastData(responseBody, 'Người dùng đã bị vô hiệu hóa');

		return { toastData };
	},

	delete: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!id) return fail(400, { message: 'Missing id' });

		const { responseBody } = await fetchAuthorizedApi(cookies, `/api/admin/user/${id}`, 'DELETE');

		const toastData = getToastData(responseBody, 'Đã xoá người dùng');

		return { toastData };
	},

	toggleRole: async ({ request, cookies }) => {
		const data = await request.formData();
		const userId = data.get('userId');
		const role = data.get('role');
		const isAlreadyHaveRole = data.get('isAlreadyHaveRole');

		if (!userId || !role || !isAlreadyHaveRole)
			return fail(400, { message: 'Lỗi, thiếu dữ liệu cần thiết' });

		let responseBody;
		if (isAlreadyHaveRole === 'true') {
			const { responseBody: resBody } = await fetchAuthorizedApi(
				cookies,
				`/api/admin/user/role/remove`,
				'POST',
				{
					userId,
					role
				}
			);
			responseBody = resBody;
		} else {
			const { responseBody: resBody } = await fetchAuthorizedApi(
				cookies,
				`/api/admin/user/role/assign`,
				'POST',
				{
					userId,
					role
				}
			);
			responseBody = resBody;
		}

		const toastData = getToastData(responseBody, 'Vai trò đã được cập nhật');

		return { toastData };
	}
};
