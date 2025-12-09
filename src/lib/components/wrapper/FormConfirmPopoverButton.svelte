<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		action,
		formData,
		popoverId,
		openButtonProps,
		dropdownClass = 'dropdown-left dropdown-end',
		dropdownContent = {
			label: 'Xác nhận?',
			description: '',
			confirmBtnClass: 'btn-success',
			confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
			confirmBtnText: 'Xác nhận'
		},
		children
	}: {
		action: string;
		formData: Record<string, string>;
		popoverId: string;
		openButtonProps: HTMLButtonAttributes;
		dropdownClass?: string;
		dropdownContent: {
			label: string;
			description: string;
			confirmBtnClass: string;
			confirmBtnIcon: string;
			confirmBtnText: string;
		};
		children: Snippet;
	} = $props();

	let popover: HTMLDivElement | null = $state(null);
	let isSubmitting = $state(false);
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		isSubmitting = true;

		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}}
>
	<!-- Store Form Data values into hidden input -->
	{#each Object.entries(formData) as [key, value]}
		<input type="hidden" name={key} {value} />
	{/each}

	<button
		type="button"
		class="btn"
		popovertarget={popoverId}
		style="anchor-name:--{popoverId}"
		{...openButtonProps}
	>
		{@render children()}
	</button>

	<div
		bind:this={popover}
		class="dropdown {dropdownClass}"
		popover
		id={popoverId}
		style="position-anchor:--{popoverId}"
	>
		<div class="m-1 flex w-80 flex-col gap-2 rounded-field border bg-base-100 p-4 shadow">
			<p class="font-bold">{dropdownContent.label}</p>
			<p class="text-xs text-base-content/60">{dropdownContent.description}</p>
			<div class="mt-1 flex justify-end gap-2">
				<button
					class="btn btn-sm"
					type="button"
					onclick={() => popover?.hidePopover()}
					disabled={isSubmitting}>Để sau</button
				>
				<button
					type="submit"
					class="btn btn-sm {dropdownContent.confirmBtnClass}"
					disabled={isSubmitting}
				>
					<span class={dropdownContent.confirmBtnIcon}></span>{dropdownContent.confirmBtnText}
				</button>
			</div>
		</div>
	</div>
</form>
