<script lang="ts">
	import ShopInfoForm from '$lib/components/form/ShopInfoForm.svelte';
	import ShopFrontPage from '$lib/components/layout/ShopFrontPage.svelte';

	const { data } = $props();
</script>

<ShopInfoForm dataForm={data.form} shop={data.shop} />
