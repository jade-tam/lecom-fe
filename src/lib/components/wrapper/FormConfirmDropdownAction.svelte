<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	const {
		label,
		description,
		action,
		formData,
		dropdownDirection = 'dropdown-left dropdown-center',
		confirmButtonClass = 'btn-error',
		confirmButtonIcon = 'icon-[fa7-solid--check-circle]',
		children
	}: {
		label: string;
		description?: string;
		action: string;
		formData: Record<string, string>;
		dropdownDirection?: string;
		confirmButtonClass?: string;
		confirmButtonIcon?: string;
		children: Snippet;
	} = $props();
</script>

<form method="POST" {action} use:enhance>
	<!-- Store Form Data values into hidden input -->
	{#each Object.entries(formData) as [key, value]}
		<input type="hidden" name={key} {value} />
	{/each}

	<div class="dropdown {dropdownDirection}">
		{@render children()}

		<div
			tabindex="-1"
			class="dropdown-content m-1 flex w-64 flex-col gap-2 rounded-field border bg-base-100 p-4 shadow"
		>
			<p class="font-bold">{label}</p>
			<p class="text-xs text-base-content/60">{description}</p>
			<button class="btn mt-1 {confirmButtonClass}" type="submit">
				<span class={confirmButtonIcon}></span>Confirm
			</button>
		</div>
	</div>
</form>
