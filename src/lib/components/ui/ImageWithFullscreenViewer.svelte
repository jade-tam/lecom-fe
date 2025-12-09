<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	const {
		src,
		alt = '',
		class: customClass = ''
	} = $props<{
		src: string | null | undefined;
		alt?: string;
		class?: string;
	}>();

	let isImageError = $state(false);
	let isFullscreen = $state(false);

	function handleError() {
		isImageError = true;
	}

	function openFullscreen() {
		if (src && !isImageError) {
			isFullscreen = true;
		}
	}

	function closeFullscreen() {
		isFullscreen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isFullscreen) {
			closeFullscreen();
		}
	}

	$effect(() => {
		if (isFullscreen) {
			document.addEventListener('keydown', handleKeydown);
			return () => {
				document.removeEventListener('keydown', handleKeydown);
			};
		}
	});
</script>

<div class="{customClass}  rounded-field overflow-hidden">
	{#if src && !isImageError}
		<button
			type="button"
			class="h-full w-full cursor-pointer p-0"
			onclick={openFullscreen}
			aria-label="Open fullscreen view"
		>
			<img
				{src}
				{alt}
				class="h-full w-full object-cover"
				draggable="false"
				onerror={handleError}
			/>
		</button>
	{:else}
		<div
			class="[container-type:size] flex h-full flex-col items-center justify-center bg-secondary text-secondary-content"
		>
			<span class="icon-[mingcute--photo-album-line] text-[40cqh]"></span>
			<span class="text-[8cqh]">Không có ảnh</span>
		</div>
	{/if}
</div>

{#if isFullscreen}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
		onclick={closeFullscreen}
		role="button"
		tabindex="0"
		aria-label="Close fullscreen"
		onkeydown={(e) => {}}
	>
		<div
			transition:fly={{ duration: 200, y: -20 }}
			class="relative max-h-screen max-w-4xl overflow-hidden rounded-box"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<img {src} {alt} class="max-h-screen max-w-full object-contain" />
			<button
				type="button"
				class="btn absolute top-4 right-4 btn-square"
				onclick={closeFullscreen}
				aria-label="Close fullscreen"
			>
				<span class="icon-[mingcute--close-line] text-xl"></span>
			</button>
		</div>
	</div>
{/if}
