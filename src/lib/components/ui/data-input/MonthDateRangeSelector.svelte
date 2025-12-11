<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { toDateISO } from '$lib/utils/converters';

	let {
		popoverId,
		startDate = $bindable(null),
		endDate = $bindable(null),
		openButtonProps,
		onMonthSelected,
		children
	}: {
		popoverId: string;
		startDate?: string | null;
		endDate?: string | null;
		openButtonProps?: HTMLButtonAttributes;
		onMonthSelected?: (startDate: Date, endDate: Date) => void;
		children: Snippet;
	} = $props();

	let popover: HTMLDivElement | null = $state(null);

	// Generate list of available months (last 3 months + current month)
	const availableMonths = $derived.by(() => {
		const months = [];
		const now = new Date();

		// Start from 3 months ago
		const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
		const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

		const current = new Date(start);

		while (current <= end) {
			const monthStart = new Date(current);
			const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

			months.push({
				date: new Date(current),
				label: current.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
				startDate: monthStart,
				endDate: monthEnd
			});

			current.setMonth(current.getMonth() + 1);
		}

		return months;
	});

	function handleMonthSelect(month: (typeof availableMonths)[0]) {
		startDate = toDateISO(month.startDate);
		endDate = toDateISO(month.endDate);

		if (onMonthSelected) {
			onMonthSelected(month.startDate, month.endDate);
		}

		// Close the popover
		if (popover) {
			popover.hidePopover?.();
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
	id={popoverId}
	class="dropdown rounded-box border bg-base-100 shadow-lg"
	style="position-anchor:--{popoverId}"
	bind:this={popover}
>
	<div class="flex flex-col gap-1 p-2">
		{#each availableMonths as month (month.date.toISOString())}
			<button
				type="button"
				class="btn justify-start btn-ghost btn-xs btn-info"
				onclick={() => handleMonthSelect(month)}
			>
				{month.label}
			</button>
		{/each}
	</div>
</div>
