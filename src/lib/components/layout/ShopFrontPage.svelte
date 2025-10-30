<script lang="ts">
	import type { Shop } from '$lib/types/Shop';
	import IconFacebook from '../others/IconFacebook.svelte';
	import IconInstagram from '../others/IconInstagram.svelte';
	import IconTiktok from '../others/IconTiktok.svelte';
	import Image from '../ui/Image.svelte';

	const {
		shop,
		haveSellerAction = false
	}: {
		shop: Shop;
		haveSellerAction?: boolean;
	} = $props();

	$inspect(shop)

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
		<div class="absolute top-3 right-3 flex gap-2">
			<a class="btn btn-info" href="/seller/my-shop/update"
				><span class="icon-[fa7-solid--edit]"></span>Update Shop Info</a
			>
			<a class="btn btn-primary" href="/seller/products"
				><span class="icon-[fa7-solid--box-open]"></span>Manage Products</a
			>
		</div>
	{/if}
</div>

<div class="tabs-border mt-4 tabs">
	<label class="tab gap-2 text-primary-content hover:text-primary-content">
		<input type="radio" name="my_tab" checked />
		<span class="icon-[fa7-solid--box-open]"></span>
		Products ({5})
	</label>

	<div class="tab-content p-4">Products show here</div>

	<label class="tab gap-2 text-secondary-content hover:text-secondary-content">
		<input type="radio" name="my_tab" checked />
		<span class="icon-[fa7-solid--book]"></span>
		Courses ({9})
	</label>

	<div class="tab-content p-4">Courses show here</div>
</div>

<div class="mt-4 flex flex-col items-center gap-4 rounded-box border bg-base-100 p-4">
	<p class="font-serif font-bold">Get in Touch</p>
	<a class="btn btn-sm btn-success" href="tel:{shop.phoneNumber}"
		><span class="icon-[fa7-solid--phone] shrink-0"></span>Call us now</a
	>
	<div class="flex gap-2">
		<a
			class="btn btn-square text-info-content btn-ghost btn-info"
			href={shop.shopFacebook}
			aria-label="facebook link"
			target="_blank"
		>
			<IconFacebook />
		</a>
		<a
			class="btn btn-square text-error-content btn-ghost btn-error"
			href={shop.shopInstagram}
			aria-label="instagram link"
			target="_blank"
		>
			<IconInstagram />
		</a>
		<a
			class="btn btn-square text-secondary-content btn-ghost btn-secondary"
			href={shop.shopTiktok}
			aria-label="tiktok link"
			target="_blank"
		>
			<IconTiktok />
		</a>
	</div>
	<p class="text-sm text-base-content/60">Follow to receive shop updates and exclusive offers.</p>
</div>
