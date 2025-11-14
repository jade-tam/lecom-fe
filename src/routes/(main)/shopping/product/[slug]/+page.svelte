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
		<div class="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
			<div class="col-span-1 max-md:col-span-2">
				<ImageViewer images={product.images.map((image) => image.url) ?? []} />
			</div>

			<div class="col-span-1 flex flex-col gap-4 max-md:col-span-2">
				<p class="text-header3 font-serif">{product.name}</p>
				<div class="badge badge-secondary">{product.categoryName}</div>
				<p class="text-header1 font-serif text-primary-content">{formatVND(product.price)}</p>
				<p class="text-sm text-base-content/60 italic">
					<strong>{product.stock}</strong> items in stock
				</p>

				<QuantitySelector bind:value={$form['quantity']} />

				<form action="?/addToCart" use:enhance method="POST">
					<FormInput
						name="quantity"
						type="number"
						hidden
						label="Quantity"
						superForm={form}
						{errors}
					/>
					<FormInput
						name="productId"
						type="text"
						label="productId"
						superForm={form}
						{errors}
						hidden
					/>
					<div class="flex gap-2">
						<button type="submit" class="btn grow btn-primary">
							<span class="icon-[fa7-solid--cart-plus]"></span>Add to cart
						</button>
						<div class="tooltip" data-tip={isWishlist ? 'Added to wishlist' : 'Add to wishlist'}>
							<button
								type="button"
								class="btn btn-square {isWishlist ? 'btn-error' : 'btn-secondary'}"
								aria-label={isWishlist ? 'Added to wishlist' : 'Add to wishlist'}
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

			<div class="col-span-2 mt-2 rounded-box border bg-base-100 p-6 max-md:p-4">
				<p class="text-header3">Product description</p>
				<div class="prose prose-sm mt-6 whitespace-pre-line">{product.description}</div>
			</div>

			<div class="col-span-2 mt-2 rounded-box border bg-base-100 p-6 max-md:p-4">
				<p class="text-header3">Similar products</p>

				{#await data.similarProductsPromise}
					<div class="mt-4 grid grid-cols-4 gap-4">
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
					</div>
				{:then similarProducts}
					{#if similarProducts.length}
						<div class="mt-4 grid grid-cols-4 gap-4">
							{#each similarProducts as products (product.id)}
								<ProductCard {product} />
							{/each}
						</div>
					{:else}
						<EmptyPlaceholder text="No similar product found" />
					{/if}
				{/await}
			</div>
		</div>
	{:else}
		<EmptyPlaceholder text="This product is not exist" />
	{/if}
</section>
