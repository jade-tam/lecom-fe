<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import ProductCard from '$lib/components/ui/card/ProductCard.svelte';
	import ShopCard from '$lib/components/ui/card/ShopCard.svelte';
	import ProductFeedbackSummary from '$lib/components/ui/data-display/ProductFeedbackSummary.svelte';
	import QuantitySelector from '$lib/components/ui/data-input/QuantitySelector.svelte';
	import Rating from '$lib/components/ui/data-input/Rating.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import ImageViewer from '$lib/components/ui/ImageViewer.svelte';
	import ProductCardSkeleton from '$lib/components/ui/skeleton/ProductCardSkeleton.svelte';
	import FormAction from '$lib/components/wrapper/FormAction.svelte';
	import { getUserProfile } from '$lib/context/appContext.js';
	import { addToCartSchema, type AddToCartSchema } from '$lib/schemas/cartSchema.js';
	import { formatVND } from '$lib/utils/converters.js';
	import type { ToastData } from '$lib/utils/showToast.js';
	import showToast from '$lib/utils/showToast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data, form: normalForm } = $props();
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

	$effect(() => {
		if (normalForm?.toastData) {
			showToast(normalForm.toastData);

			console.log(normalForm?.responseBody);

			if (normalForm.toastData.type === 'success') {
				goto(
					resolve('/(authenticated)/chat/[conversationId]', {
						conversationId: normalForm.responseBody.result.id
					})
				);
			}
		}
	});

	const userProfile = $derived(getUserProfile());

	let isWishlist = $state(false);
</script>

<section class="mt-8 flex min-h-screen flex-col items-center">
	{#if product}
		<div class="grid w-full grid-cols-12 gap-x-4 gap-y-2 max-md:grid-cols-1">
			<AnimatedDiv animateVars={{ translateX: -16 }} class="col-span-5 max-md:col-span-1">
				<ImageViewer
					images={product.images.sort((a, b) => a.orderIndex - b.orderIndex).map((image) => image.url) ?? []}
					viewTransitionName={`product-image-${product.id}`}
				/>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: -16 }}
				class="col-span-7 flex flex-col gap-2 max-md:col-span-1"
			>
				<p
					class="text-header3 font-serif"
					style={`view-transition-name: product-name-${product.id};`}
				>
					{product.name}
				</p>
				<div class="flex items-center gap-4">
					<div>
						{#if product.averageRating !== undefined}
							<Rating defaultValue={product.averageRating} readonly={true} />
						{:else}
							<span class="text-sm text-base-content/70 italic">
								<Rating defaultValue={0} readonly={true} />
							</span>
						{/if}
						<p class="text-xs italic">
							{#if product.ratingCount !== undefined}
								{product.ratingCount === 0
									? 'Chưa có đánh giá'
									: `${product.ratingCount} lượt đánh giá`}
							{:else}
								không có dữ liệu
							{/if}
						</p>
					</div>
					<div
						class="badge badge-sm badge-secondary"
						style={`view-transition-name: product-category-${product.id};`}
					>
						{product.categoryName}
					</div>
				</div>
				<p
					class="text-header1 font-serif text-primary-content"
					style={`view-transition-name: product-price-${product.id};`}
				>
					{formatVND(product.price)}
				</p>
				<p class="text-sm text-base-content/70 italic">
					{#if product.stock === 0}
						Hết hàng
					{:else if product.stock <= 5}
						Chỉ còn <strong>{product.stock}</strong> sản phẩm trong kho, hãy nhanh tay mua kẻo hết!
					{:else}
						Còn <strong>{product.stock}</strong> sản phẩm trong kho
					{/if}
				</p>

				{#if userProfile}
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
							{#if product.stock > 0}
								<button type="submit" class="btn grow btn-primary">
									<span class="icon-[fa7-solid--cart-plus]"></span>Thêm vào giỏ hàng
								</button>
							{:else}
								<button type="button" class="btn btn-disabled grow" disabled>
									<span class="icon-[fa7-solid--cart-plus]"></span>Đã hết hàng
								</button>
							{/if}
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

					<div class="mt-2 flex flex-col gap-2">
						<p class="flex items-center gap-2 font-serif font-bold text-info-content">
							<span class="icon-[mingcute--message-4-fill]"></span>Liên hệ hỗ trợ
						</p>
						<div class="flex gap-1">
							<FormAction action="?/openChat" formData={{ productId: product.id, toAI: 'false' }}>
								<button type="submit" class="btn btn-sm btn-info">
									<span class="icon-[mingcute--send-fill] text-lg"></span>Gửi tin nhắn cho cửa hàng
								</button>
							</FormAction>
							<FormAction action="?/openChat" formData={{ productId: product.id, toAI: 'true' }}>
								<button type="submit" class="btn btn-sm btn-warning">
									<span class="icon-[mingcute--ai-fill] text-lg"></span>Hỏi AI về sản phẩm
								</button>
							</FormAction>
						</div>
					</div>
				{:else}
					<a type="submit" class="btn btn-primary" href={resolve('/auth/login')}>
						<span class="icon-[mingcute--arrow-to-right-fill] text-lg"></span>Đăng nhập để mua hàng
						ngay
					</a>
				{/if}

				<ShopCard
					shop={{
						id: product.shopId,
						name: product.shopName,
						description: product.shopDescription,
						shopAvatar: product.shopAvatar
					}}
				/>
			</AnimatedDiv>

			<AnimatedDiv
				animateVars={{ translateY: 16 }}
				class="col-span-12 rounded-box border bg-base-100 p-4 max-md:col-span-1 max-md:p-4"
			>
				<p class="text-header3">Chi tiết sản phẩm</p>
				<div class="prose prose-sm mt-6 whitespace-pre-line">{product.description}</div>
			</AnimatedDiv>

			<ProductFeedbackSummary feedbackSummaryPromise={data.feedbackSummaryPromise} />

			<div class="col-span-12 mt-2 max-md:col-span-1">
				<p class="text-header3">Sản phẩm tương tự</p>

				{#await data.similarProductsPromise}
					<div class="mt-2 grid grid-cols-4 gap-2 max-md:grid-cols-2">
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
						<ProductCardSkeleton />
					</div>
				{:then similarProducts}
					{#if similarProducts.length}
						<div class="mt-2 grid grid-cols-4 gap-2 max-md:grid-cols-2">
							{#each similarProducts.slice(0, 4) as similarProduct (similarProduct.id)}
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
