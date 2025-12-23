<script lang="ts">
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import type { Category } from '$lib/types/Category';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { categories }: { categories: Category[] } = $props();

	const pageSize = 12;

	const table = new DataTable({
		pageSize: pageSize,
		data: categories.map((c) => ({
			...c,
			description: c.description?.trim() || 'No description'
		})),
		columns: [
			{ id: 'name', key: 'name', name: 'Tên danh mục' },
			{ id: 'description', key: 'description', name: 'Mô tả chi tiết' }
		]
	});
</script>

<div class="rounded-box border bg-base-100 p-4">
	<div class="overflow-x-auto">
		<table class="table table-sm">
			<thead>
				<tr class="text-base-content">
					{#each table.columns as column (column.id)}
						<th>
							<button
								class="flex items-center gap-1"
								onclick={() => table.toggleSort(column.id)}
								disabled={!table.isSortable(column.id)}
							>
								{column.name}
								<!-- SORT BUTTON -->
								{#if table.isSortable(column.id)}
									{#if table.getSortState(column.id) === 'asc'}
										<span class="icon-[mingcute--sort-ascending-fill] text-primary-content"></span>
									{:else if table.getSortState(column.id) === 'desc'}
										<span class="icon-[mingcute--sort-descending-fill] text-primary-content"></span>
									{:else}
										<span class="icon-[mingcute--menu-fill] text-base-content/20"></span>
									{/if}
								{/if}
							</button>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'name'}
								<td class="text-base font-bold text-success-content">{row[column.key]}</td>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</div>
