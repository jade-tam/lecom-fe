<script lang="ts">
	import ShopFrontPage from '$lib/components/layout/ShopFrontPage.svelte';

	const { data } = $props();
	const shop = $derived(data.shop);
</script>

<ShopFrontPage {shop} haveSellerAction />
