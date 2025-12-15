<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		onEnter,
		...restAttributes
	}: HTMLInputAttributes & { onEnter?: (value: string) => void } = $props();

	let searchInput: HTMLInputElement | null = null;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			onEnter?.(value.trim());
		}
	}

	onMount(() => {
		const handleShortcut = (e: KeyboardEvent) => {
			// Detect Ctrl+K or Cmd+K
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				searchInput?.focus();
			}
		};

		window.addEventListener('keydown', handleShortcut);
		return () => window.removeEventListener('keydown', handleShortcut);
	});
</script>

<label class="input w-full">
	<span class="icon-[fa7-solid--search] shrink-0"></span>
	<input
		bind:this={searchInput}
		bind:value
		type="search"
		class="grow"
		placeholder="Tìm kiếm..."
		onkeydown={handleKeydown}
		{...restAttributes}
	/>
	<kbd class="kbd kbd-sm">Ctrl</kbd>
	<kbd class="kbd kbd-sm">K</kbd>
</label>
