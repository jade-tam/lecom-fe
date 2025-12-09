<script lang="ts">
	const {
		src,
		alt = '',
		rounded = 'rounded-field',
		border = 'border',
		objectFit = 'object-cover',
		class: customClass = '',
		viewTransitionName
	} = $props<{
		src: string | null | undefined;
		alt?: string;
		w?: string; // Tailwind width class
		h?: string; // Tailwind height class
		rounded?: string; // e.g. rounded, rounded-lg, rounded-full
		border?: string; // border class or ''
		objectFit?: string; // e.g. object-cover, object-contain
		class?: string; // extra classes
		viewTransitionName?: string;
	}>();

	let isImageError = $state(false);

	function handleError() {
		isImageError = true;
	}
</script>

<div
	class={`overflow-hidden bg-secondary ${rounded} ${border} ${customClass}`}
	style={viewTransitionName ? `view-transition-name: ${viewTransitionName};` : ''}
>
	{#if src && !isImageError}
		<img {src} {alt} class={`h-full w-full ${objectFit}`} draggable="false" onerror={handleError} />
	{:else}
		<div class="[container-type:size] flex h-full flex-col items-center justify-center text-secondary-content">
			<span class="icon-[mingcute--photo-album-line] text-[40cqh] "></span><span class="text-[8cqh]">Không có ảnh</span>
		</div>
	{/if}
</div>
