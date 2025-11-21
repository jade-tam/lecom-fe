<script lang="ts">
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';
	import ShopCard from '$lib/components/ui/card/ShopCard.svelte';
	import QuantitySelector from '$lib/components/ui/data-input/QuantitySelector.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import ImageViewer from '$lib/components/ui/ImageViewer.svelte';
	import ProductCardSkeleton from '$lib/components/ui/skeleton/ProductCardSkeleton.svelte';
	import { addToCartSchema, type AddToCartSchema } from '$lib/schemas/cartSchema.js';
	import { registerShopSchema } from '$lib/schemas/registerShopSchema.js';
	import { formatVND } from '$lib/utils/converters.js';
	import type { ToastData } from '$lib/utils/showToast.js';
	import showToast from '$lib/utils/showToast.js';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const product = $derived(data.product);

	const { form, errors, message, enhance, submitting, delayed } = superForm<
		AddToCartSchema,
		ToastData
	>(data.form, {
		validators: zod4Client(addToCartSchema)
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});

	let isWishlist = $state(false);
</script>

<section class="mt-8 flex min-h-screen flex-col items-center">
	{#if product}
		<div class="grid w-full grid-cols-12 gap-x-4 gap-y-2 max-md:grid-cols-1">
			<div class="col-span-5 max-md:col-span-1">
				<ImageViewer images={product.images.map((image) => image.url) ?? []} />
			</div>

			<div class="col-span-7 flex flex-col gap-2 max-md:col-span-1">
				<p class="text-header3 font-serif">{product.name}</p>
				<div class="badge badge-secondary">{product.categoryName}</div>
				<p class="text-header1 font-serif text-primary-content">{formatVND(product.price)}</p>
				<p class="text-sm text-base-content/60 italic">
					Còn <strong>{product.stock}</strong> sản phẩm trong kho
				</p>

				<QuantitySelector bind:value={$form['quantity']} />

				<form action="?/addToCart" use:enhance method="POST">
					<FormInput
						name="quantity"
						type="number"
						hidden
						label="Số lượng"
						superForm={form}
						{errors}
					/>
					<FormInput
						name="productId"
						type="text"
						label="Mã sản phẩm"
						superForm={form}
						{errors}
						hidden
					/>
					<div class="flex gap-2">
						<button type="submit" class="btn grow btn-primary">
							<span class="icon-[fa7-solid--cart-plus]"></span>Thêm vào giỏ hàng
						</button>
						<div
							class="tooltip"
							data-tip={isWishlist ? 'Đã thêm vào mục yêu thích' : 'Thêm vào mục yêu thích'}
						>
							<button
								type="button"
								class="btn btn-square {isWishlist ? 'btn-error' : 'btn-secondary'}"
								aria-label={isWishlist ? 'Đã thêm vào mục yêu thích' : 'Thêm vào mục yêu thích'}
								onclick={() => (isWishlist = !isWishlist)}
							>
								<span class="icon-[fa7-solid--heart] btn-xl"></span>
							</button>
						</div>
					</div>
				</form>

				<ShopCard
					shop={{
						id: product.shopId,
						name: product.shopName,
						description: product.shopDescription,
						shopAvatar: product.shopAvatar
					}}
				/>
			</div>

			<div class="col-span-12 rounded-box border bg-base-100 p-6 max-md:col-span-1 max-md:p-4">
				<p class="text-header3">Chi tiết sản phẩm</p>
				<div class="prose prose-sm mt-6 whitespace-pre-line">{product.description}</div>
			</div>

			<div class="col-span-12 rounded-box border bg-base-100 p-6 max-md:col-span-1 max-md:p-4">
				<p class="text-header3">Sản phẩm tương tự</p>

				{#await data.similarProductsPromise}
					<div class="mt-4 grid grid-cols-4 gap-2">
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
					</div>
				{:then similarProducts}
					{#if similarProducts.length}
						<div class="mt-4 grid grid-cols-4 gap-2">
							{#each similarProducts as similarProduct (similarProduct.id)}
								<ProductCard product={similarProduct} />
							{/each}
						</div>
					{:else}
						<EmptyPlaceholder text="Không tìm thấy sản phẩm tương tự" />
					{/if}
				{/await}
			</div>
		</div>
	{:else}
		<EmptyPlaceholder text="Sản phẩm không tồn tại" />
	{/if}
</section>
