<script lang="ts">
	import type { Shop } from '$lib/types/Shop';
	import { DataTable } from '@careswitch/svelte-data-table';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import { shopStatusOptions } from '$lib/consts/shopStatusOptions';
	import { getStatusBadgeClass, getStatusBtnClass } from '$lib/utils/classComposer';

	const { shops }: { shops: Shop[] } = $props();

	const pageSize = 12;

	const table = new DataTable({
		pageSize: pageSize,
		data: shops,
		columns: [
			{ id: 'id', key: 'id', name: 'ID' },
			{ id: 'name', key: 'name', name: 'Name' },
			{ id: 'description', key: 'description', name: 'Description' },
			{ id: 'ownerFullName', key: 'ownerFullName', name: 'Owner Full Name' },
			{ id: 'phoneNumber', key: 'phoneNumber', name: 'Phone Number' },
			{ id: 'businessType', key: 'businessType', name: 'Business Type' },
			{ id: 'categoryName', key: 'categoryName', name: 'Category' },
			{ id: 'status', key: 'status', name: 'Status' }
		]
	});
</script>

<div class="my-2 flex justify-between">
	<h2>Shops Management</h2>

	<div class="flex gap-2">
		<form class="flex justify-end gap-1">
			{#each shopStatusOptions as option}
				<input
					class={`btn ${getStatusBtnClass(option.value)} not-checked:btn-soft`}
					type="checkbox"
					name="status"
					aria-label={option.title}
					checked={table.isFilterActive('status', option.value)}
					onchange={() => table.toggleFilter('status', option.value)}
				/>
			{/each}
			<input
				class="btn btn-square btn-soft btn-error"
				type="reset"
				value="×"
				onclick={() => table.clearFilter('status')}
			/>
		</form>
		<SearchInput bind:value={table.globalFilter} />
	</div>
</div>

<div class="rounded-box border bg-base-100 p-4">
	<div class="overflow-x-auto">
		<table class="table">
			<thead>
				<tr class="text-base-content">
					{#each table.columns as column (column.id)}
						<th>
							<button
								class="flex items-center"
								onclick={() => table.toggleSort(column.id)}
								disabled={!table.isSortable(column.id)}
							>
								{column.name}
								<!-- SORT BUTTON -->
								{#if table.isSortable(column.id)}
									<span class="ml-2">
										{#if table.getSortState(column.id) === 'asc'}
											<span class="icon-[fa7-solid--sort-asc]"></span>
										{:else if table.getSortState(column.id) === 'desc'}
											<span class="icon-[fa7-solid--sort-desc]"></span>
										{:else}
											<span class="icon-[fa7-solid--sort]"></span>
										{/if}
									</span>
								{/if}
							</button>
						</th>
					{/each}

					<th> </th>
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'status'}
								<td
									><div
										class={`badge ${getStatusBadgeClass(row.status)}`}
									>
										{row[column.key]}
									</div></td
								>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
						<td>
							<button class="btn">
								<span class="icon-[fa7-solid--file-invoice]"></span>View Details
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</div>
