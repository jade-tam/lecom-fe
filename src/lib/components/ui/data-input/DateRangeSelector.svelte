<script lang="ts">
	import { toDateISO } from '$lib/utils/converters.js';
	import 'cally';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		popoverId,
		startDate = $bindable(null),
		endDate = $bindable(null),
		openButtonProps,
		rangeEndCallback,
		children
	}: {
		popoverId: string;
		startDate?: string | null;
		endDate?: string | null;
		openButtonProps?: HTMLButtonAttributes;
		rangeEndCallback?: (endDate: Date) => void;
		children: Snippet;
	} = $props();

	let popover: HTMLDivElement | null = $state(null);

	function handleRangeStart(event: CustomEvent<Date>) {
		startDate = toDateISO(event.detail);
	}

	function handleRangeEnd(event: CustomEvent<Date>) {
		endDate = toDateISO(event.detail);
		rangeEndCallback?.(event.detail);
		popover?.hidePopover();
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
	id={popoverId}
	class="dropdown rounded-box border bg-base-100 shadow-lg"
	style="position-anchor:--{popoverId}"
	bind:this={popover}
>
	<calendar-range
		months={2}
		class="cally"
		onrangestart={handleRangeStart}
		onrangeend={handleRangeEnd}
		locale="vi-VN"
	>
		<span
			class="icon-[mingcute--square-arrow-left-fill] text-xl text-secondary-content/90"
			slot="previous"
		></span>
		<span
			class="icon-[mingcute--square-arrow-right-fill] text-xl text-secondary-content/90"
			slot="next"
		></span>
		<div class="flex gap-4">
			<calendar-month></calendar-month>
			<calendar-month offset={1}></calendar-month>
		</div>
	</calendar-range>
</div>
