<script lang="ts">
	import ShopFrontPage from '$lib/components/layout/ShopFrontPage.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';

	const { data } = $props();
</script>

{#if data.shop}
	<ShopFrontPage
		shop={data.shop}
		products={data.products}
		courses={data.courses}
		haveSellerAction
	/>
{:else}
	<EmptyPlaceholder text="Có lỗi xảy ra, không tìm thấy shop của bạn." />
{/if}
