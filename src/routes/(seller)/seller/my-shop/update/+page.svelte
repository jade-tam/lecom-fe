<script lang="ts">
	import ShopInfoForm from '$lib/components/form/ShopInfoForm.svelte';

	const { data } = $props();
</script>

<ShopInfoForm dataForm={data.form} shop={data.shop} />
