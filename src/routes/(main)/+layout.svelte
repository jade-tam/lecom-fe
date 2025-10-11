<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import { setContext } from 'svelte';

	let { children, data } = $props();

	setContext('userProfile', () => data.userProfile);
</script>

<div class="mx-auto max-w-7xl p-4">
	<Header />

	{@render children?.()}
</div>
