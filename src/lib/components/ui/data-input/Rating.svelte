<script lang="ts">

	let {
		defaultValue,
		value = $bindable(0),
		readonly = false
	}: { defaultValue: number; value?: number; readonly?: boolean } = $props();

	const maxStars = 5;
	let hoverValue: number | null = $state(null);

	const displayValue = $derived(value && value !== 0 ? value : defaultValue);
	const isUserRated = $derived(value && value !== 0 && value !== defaultValue);

	function setRating(star: number) {
		if (!readonly) value = star;
	}

	const fullStarIconClass = 'icon-[mingcute--star-fill]';
	const halfStarIconClass = 'icon-[mingcute--star-half-fill]';
	const emptyStarIconClass = 'icon-[mingcute--star-line]';
</script>


<div class="flex items-center">
	{#each Array(maxStars) as _, i}
		<button
			type="button"
			disabled={readonly}
			class="m-0 cursor-pointer border-none bg-transparent p-0 {!readonly ? 'text-header2' : ''}"
			onmouseenter={() => {
				if (!readonly) hoverValue = i + 1;
			}}
			onmouseleave={() => {
				if (!readonly) hoverValue = null;
			}}
			onclick={() => setRating(i + 1)}
			aria-label={`Đánh giá ${i + 1} sao`}
		>
			<span
				class="{(hoverValue ? i < hoverValue : i < displayValue)
					? isUserRated
						? 'text-primary'
						: 'text-warning'
					: 'text-base-content/30'} duration-200"
			>
				{#if hoverValue !== null}
					<span class={i < hoverValue ? fullStarIconClass : emptyStarIconClass}></span>
				{:else if isUserRated}
					<span class={i < displayValue ? fullStarIconClass : emptyStarIconClass}></span>
				{:else if i + 1 <= Math.floor(displayValue)}
					<span class={fullStarIconClass}></span>
				{:else if i < displayValue}
					<span class={halfStarIconClass}></span>
				{:else}
					<span class={emptyStarIconClass}></span>
				{/if}
			</span>
		</button>
	{/each}
	{#if displayValue}
		<p class="mb-1 ml-1 text-xs font-bold text-primary-content">{displayValue.toFixed(1)}</p>
	{/if}
</div>
