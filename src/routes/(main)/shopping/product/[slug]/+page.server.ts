import { addToCartSchema } from '$lib/schemas/cartSchema.js';
import type { Product } from '$lib/types/Product';
import { fetchApi, fetchAuthorizedApi, getSafeResult, getToastData } from '$lib/utils/externalApi';
import type { ToastData } from '$lib/utils/showToast.js';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export async function load({ params }) {
	const { slug } = params;

	const product: Product | null = await getSafeResult(
		fetchApi<Product>(`/api/home/products/by-slug/${slug}`, 'GET'),
		null
	);

	const similarProductsPromise: Promise<Product[]> = getSafeResult(
		fetchApi(`/api/recombee/similar/${product?.id}`, 'GET'),
		[] as Product[]
	);

	const form = await superValidate(
		{
			productId: product?.id,
			quantity: 1
		},
		zod4(addToCartSchema)
	);

	return {
		form,
		product: product,
		similarProductsPromise
	};
}

export const actions = {
	addToCart: async ({ request, cookies }) => {
		const form = await superValidate(request, zod4(addToCartSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const formData = form.data;

		const { response, responseBody } = await fetchAuthorizedApi(
			cookies,
			'/api/cart/items',
			'POST',
			formData
		);

		const toastData: ToastData = getToastData(responseBody, 'Product has been added to cart');

		if (response.ok) {
			return message(form, toastData);
		} else {
			return message(form, toastData, { status: 400 });
		}
	}
};
