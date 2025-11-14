<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	const {
		action,
		formData,
		children
	}: {
		action: string;
		formData: Record<string, string>;
		children: Snippet;
	} = $props();
</script>

<form method="POST" {action} use:enhance>
	<!-- Store Form Data values into hidden input -->
	{#each Object.entries(formData) as [key, value]}
		<input type="hidden" name={key} {value} />
	{/each}
	{@render children()}
</form>
