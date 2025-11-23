<script lang="ts">
	import type { Course } from '$lib/types/Course';
	import type { Product } from '$lib/types/Product';
	import type { Shop } from '$lib/types/Shop';
	import IconFacebook from '../others/IconFacebook.svelte';
	import IconInstagram from '../others/IconInstagram.svelte';
	import IconTiktok from '../others/IconTiktok.svelte';
	import CourseCard from '../ui/card/CourseCard.svelte';
	import ProductCard from '../ui/card/ProductCard.svelte';
	import EmptyPlaceholder from '../ui/EmptyPlaceholder.svelte';
	import Image from '../ui/Image.svelte';

	const {
		shop,
		products,
		courses,
		haveSellerAction = false
	}: {
		shop: Shop;
		products: Product[];
		courses: Course[];
		haveSellerAction?: boolean;
	} = $props();

	$inspect(shop);

	let currentTab: 'Products' | 'Courses' = $state('Products');
</script>

<div class="relative mt-4 overflow-hidden rounded-box border bg-base-100">
	<Image src={shop.shopBanner} alt={shop.name} class="h-38 w-full rounded-none" border="" />
	<div class="flex gap-4 p-8 max-md:p-4">
		<div>
			<Image src={shop.shopAvatar} alt={shop.name} class="h-24  w-24 rounded-full" />
		</div>
		<div class="flex flex-col gap-3">
			<h1 class="text-header3">{shop.name}</h1>
			<div
				class="flex items-center gap-2 text-xs text-base-content/60 max-md:flex-col max-md:items-start max-md:gap-1"
			>
				<p class="flex items-center gap-2">
					<span class="icon-[fa7-solid--map-location-dot] shrink-0"></span>{shop.address}
				</p>
				<div class="divider mx-0 divider-horizontal"></div>
				<p class="flex items-center gap-2">
					<span class="icon-[fa7-solid--phone] shrink-0"></span>{shop.phoneNumber}
				</p>
				<div class="divider mx-0 divider-horizontal"></div>
				<p class="flex items-center gap-2">
					<span class="icon-[fa7-solid--swatchbook] shrink-0"></span>{shop.categoryName}
				</p>
			</div>
			<p class="line-clamp-2">{shop.description}</p>
		</div>
	</div>
	{#if haveSellerAction}
		<div class="absolute top-3 right-3 flex flex-wrap justify-end gap-2">
			<a class="btn btn-info" href="/seller/my-shop/update"
				><span class="icon-[fa7-solid--edit]"></span>Cập nhật thông tin</a
			>
			<a class="btn btn-primary" href="/seller/products"
				><span class="icon-[fa7-solid--box-open]"></span>Quản lý sản phẩm</a
			>
			<a class="btn btn-secondary" href="/seller/courses"
				><span class="icon-[fa7-solid--book]"></span>Quản lý khóa học</a
			>
		</div>
	{/if}
</div>

<div class="tabs-border mt-4 tabs">
	<label class="tab gap-2 text-primary-content hover:text-primary-content">
		<input type="radio" name="my_tab" checked />
		<span class="icon-[fa7-solid--box-open]"></span>
		Sản phẩm ({products.length})
	</label>

	<div class="tab-content">
		<div class="grid grid-cols-4 gap-4 pt-4 max-md:grid-cols-2">
			{#if products && products.length}
				{#each products as product (product.id)}
					<ProductCard {product} />
				{/each}
			{:else}
				<div class="col-span-4 max-md:col-span-2">
					<EmptyPlaceholder text="Không tìm thấy sản phẩm nào" />
				</div>
			{/if}
		</div>
	</div>

	<label class="tab gap-2 text-secondary-content hover:text-secondary-content">
		<input type="radio" name="my_tab" />
		<span class="icon-[fa7-solid--book]"></span>
		Khóa học ({courses.length})
	</label>

	<div class="tab-content">
		<div class="grid grid-cols-4 gap-4 pt-4">
			{#if courses && courses.length}
				{#each courses as course (course.id)}
					<CourseCard {course} />
				{/each}
			{:else}
				<div class="col-span-4">
					<EmptyPlaceholder text="Không tìm thấy khóa học nào" />
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="mt-4 flex flex-col items-center gap-4 rounded-box border bg-base-100 p-4">
	<p class="font-serif font-bold">Liên hệ với cửa hàng</p>
	<a class="btn btn-sm btn-success" href="tel:{shop.phoneNumber}"
		><span class="icon-[fa7-solid--phone] shrink-0"></span>Gọi ngay</a
	>
	<div class="flex gap-2">
		{#if shop.shopFacebook}
			<a
				class="btn btn-square text-info-content btn-ghost btn-info"
				href={shop.shopFacebook}
				aria-label="facebook link"
				target="_blank"
			>
				<IconFacebook />
			</a>
		{/if}
		{#if shop.shopInstagram}
			<a
				class="btn btn-square text-error-content btn-ghost btn-error"
				href={shop.shopInstagram}
				aria-label="instagram link"
				target="_blank"
			>
				<IconInstagram />
			</a>
		{/if}
		{#if shop.shopTiktok}
			<a
				class="btn btn-square text-secondary-content btn-ghost btn-secondary"
				href={shop.shopTiktok}
				aria-label="tiktok link"
				target="_blank"
			>
				<IconTiktok />
			</a>
		{/if}
	</div>
	<p class="text-sm text-base-content/60">
		Theo dõi để nhận thông báo và ưu đãi độc quyền từ cửa hàng.
	</p>
</div>
