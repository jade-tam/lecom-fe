<script lang="ts">
	import { onMount } from 'svelte';

	let { value = $bindable('') } = $props();

	let searchInput: HTMLInputElement | null = null;

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
	<span class="icon-[fa7-solid--search]"></span>
	<input bind:this={searchInput} bind:value type="search" class="grow" placeholder="Search..." />
	<kbd class="kbd kbd-sm">Ctrl</kbd>
	<kbd class="kbd kbd-sm">K</kbd>
</label>
