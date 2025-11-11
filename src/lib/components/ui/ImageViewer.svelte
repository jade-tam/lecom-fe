<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import { onMount } from 'svelte';

	let { images }: { images: string[] } = $props();
	let selected = $state(images?.[0] ?? '');
	let fullscreen = $state(false);

	function selectImage(src: string) {
		selected = src;
	}

	function toggleFullscreen() {
		fullscreen = !fullscreen;
	}

	onMount(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') fullscreen = false;
		};
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<!-- Main image area -->
<div class="relative flex flex-col items-center">
	{#if selected}
		<!-- Button wrapper for accessibility -->
		<button
			type="button"
			class="aspect-square w-full cursor-zoom-in overflow-hidden rounded-field border focus:ring-2 focus:ring-primary focus:outline-none"
			onclick={toggleFullscreen}
			aria-label="View image fullscreen"
		>
			<Image
				src={selected}
				alt="Selected product image"
				rounded=""
				objectFit="object-cover"
				border=""
				class="h-full w-full"
			/>
		</button>
	{/if}

	<!-- Thumbnail strip -->
	{#if images.length > 1}
		<div class="flex w-full justify-center gap-2 overflow-x-auto rounded-field p-2">
			{#each images as img}
				<button
					type="button"
					class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-field border transition-all focus:ring-2 focus:ring-primary-content"
					class:border-primary={selected === img}
					class:border-transparent={selected !== img}
					onclick={() => selectImage(img)}
					aria-label="Select image thumbnail"
				>
					<Image
						src={img}
						alt="Thumbnail"
						objectFit="object-cover"
						border=""
						rounded=""
						class="h-full w-full opacity-80 transition-opacity hover:opacity-100"
					/>
				</button>
			{/each}
		</div>
	{/if}
</div>

<!-- Fullscreen view (purely internal, no external wrapper needed) -->
{#if fullscreen}
	<div
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
		role="dialog"
		aria-modal="true"
		onclick={toggleFullscreen}
	>
		<Image
			src={selected}
			alt="Fullscreen image"
			objectFit="object-contain"
			rounded="rounded-field"
			border=""
			class="max-h-[95vh] max-w-[95vw] cursor-zoom-out border"
		/>
	</div>
{/if}
