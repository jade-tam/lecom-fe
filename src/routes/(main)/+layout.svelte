<script lang="ts">
	import Footer from '$lib/components/layout/Footer.svelte';
	import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<div class="mx-auto max-w-7xl p-4">
	<Header />

	{@render children?.()}
</div>

<Footer />
