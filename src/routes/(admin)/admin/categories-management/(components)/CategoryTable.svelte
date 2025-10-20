<script lang="ts">
	import type { Category } from '$lib/types/Category';
	import { DataTable } from '@careswitch/svelte-data-table';
	import Pagination from './Pagination.svelte';

	const { categories }: { categories: Category[] } = $props();

	const pageSize = 12;

	const table = new DataTable({
		pageSize: pageSize,
		data: categories.map((c) => ({
			...c,
			description: c.description?.trim() || 'No description'
		})),
		columns: [
			{ id: 'name', key: 'name', name: 'Name' },
			{ id: 'description', key: 'description', name: 'Description' }
		]
	});
</script>

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
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							<td>{row[column.key]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="flex justify-end">
			<Pagination {table} {pageSize} />
		</div>
	</div>
</div>
