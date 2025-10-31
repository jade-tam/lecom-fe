<script lang="ts">
	const {
		src,
		alt = '',
		rounded = 'rounded-field',
		border = 'border',
		objectFit = 'object-cover',
		class: customClass = ''
	} = $props<{
		src: string | undefined;
		alt?: string;
		w?: string; // Tailwind width class
		h?: string; // Tailwind height class
		rounded?: string; // e.g. rounded, rounded-lg, rounded-full
		border?: string; // border class or ''
		objectFit?: string; // e.g. object-cover, object-contain
		class?: string; // extra classes
	}>();

	let isImageError = $state(false);

	function handleError() {
		isImageError = true;
	}
</script>

<div class={`overflow-hidden bg-secondary ${rounded} ${border} ${customClass}`}>
	{#if src && !isImageError}
		<img
			{src}
			{alt}
			class={`h-full w-full ${objectFit}`}
			loading="lazy"
			draggable="false"
			onerror={handleError}
		/>
	{:else}
		<div class="flex h-full flex-col items-center justify-center">
			<span class="icon-[fa7-solid--file-circle-xmark] text-2xl text-base-content/60"></span>
		</div>
	{/if}
</div>
