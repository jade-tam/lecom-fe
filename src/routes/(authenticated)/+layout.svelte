<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<div class="mx-auto max-w-7xl p-4">
	<Header />

	{@render children?.()}
</div>
