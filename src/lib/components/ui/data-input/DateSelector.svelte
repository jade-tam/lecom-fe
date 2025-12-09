<script lang="ts">
	import 'cally';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		popoverId,
		date = $bindable(null),
		openButtonProps,
		onDateSelect,
		children
	}: {
		popoverId: string;
		date?: string | null;
		openButtonProps?: HTMLButtonAttributes;
		onDateSelect?: (date: Date) => void;
		children: Snippet;
	} = $props();

	let popover: HTMLDivElement | null = $state(null);

	function handleDateSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const selectedDate = target?.value;
		console.log('Selected date:', selectedDate);

		if (selectedDate) {
			date = selectedDate;
			onDateSelect?.(new Date(selectedDate));
			popover?.hidePopover();
		}
	}
</script>

<button
	type="button"
	popovertarget={popoverId}
	class="btn"
	style="anchor-name:--{popoverId}"
	{...openButtonProps}
>
	{@render children()}
</button>
<div
	popover
	bind:this={popover}
	id={popoverId}
	class="dropdown rounded-box bg-base-100 shadow-lg border"
	style="position-anchor:--{popoverId}"
>
	<calendar-date on:change={handleDateSelect} class="cally text-secondary-content" locale="vi-VN">
		<span class="icon-[mingcute--square-arrow-left-fill] text-xl text-secondary-content/90" slot="previous"></span>
		<span class="icon-[mingcute--square-arrow-right-fill] text-xl text-secondary-content/90" slot="next"></span>
		<calendar-month></calendar-month>
	</calendar-date>
</div>
