<script lang="ts">
	import type { DataTable } from '@careswitch/svelte-data-table';

	let {
		name,
		options,
		table,
		getFilterBtnClass
	}: {
		name: string;
		options: any;
		table: DataTable<any>;
		getFilterBtnClass: (string: any) => string;
	} = $props();
</script>

<form class="flex flex-wrap items-center justify-end gap-1">
	<div class="mr-2 flex items-center">
		<span class="icon-[fa7-solid--filter] text-secondary"></span>
	</div>
	{#each options as option (option.value)}
		<input
			class={`btn btn-dash btn-xs ${getFilterBtnClass(option.value)} not-checked:btn-outline`}
			type="checkbox"
			{name}
			aria-label={option.title}
			checked={table.isFilterActive(name, option.value)}
			onchange={() => table.toggleFilter(name, option.value)}
		/>
	{/each}
	<input
		class="btn btn-square btn-outline btn-xs btn-error"
		type="reset"
		value="×"
		onclick={() => table.clearFilter(name)}
	/>
</form>
