<script lang="ts">
	import Footer from '$lib/components/layout/Footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';

	let { children, data } = $props();
</script>

<div class="mx-auto max-w-7xl p-4">
	<Header cartCountPromise={data.cartCountPromise} />

	{@render children?.()}
</div>

<Footer />
