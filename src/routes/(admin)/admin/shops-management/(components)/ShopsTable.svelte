<script lang="ts">
	import { shopStatusOptions, type Shop } from '$lib/types/Shop';
	import { DataTable } from '@careswitch/svelte-data-table';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import { getStatusBadgeClass, getStatusBtnClass } from '$lib/utils/classComposer';
	import Image from '$lib/components/ui/Image.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';

	const { shops }: { shops: Shop[] } = $props();

	const pageSize = 12;

	const table = new DataTable({
		pageSize: pageSize,
		data: shops,
		columns: [
			{ id: 'id', key: 'id', name: 'ID' },
			{ id: 'shopAvatar', key: 'shopAvatar', name: 'Avatar' },
			{ id: 'name', key: 'name', name: 'Name' },
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
		<TableFilter
			name="status"
			options={shopStatusOptions}
			{table}
			getFilterBtnClass={getStatusBtnClass}
		/>
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
									><div class={`badge ${getStatusBadgeClass(row.status)}`}>
										{row[column.key]}
									</div></td
								>
							{:else if column.id === 'shopAvatar'}
								<td>
									<Image src={row.shopAvatar} alt="avatar" />
								</td>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
						<td>
							<a
								href={`/admin/shops-management/${row.id}`}
								class="btn {row.status === 'Pending' ? 'btn-primary' : 'btn-secondary'}"
								aria-label="view details"
							>
								<span
									class="{row.status === 'Pending'
										? 'icon-[fa7-solid--vote-yea]'
										: 'icon-[fa7-solid--eye]'} text-xl"
								></span>{row.status === 'Pending' ? 'Review' : 'Details'}
							</a>
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
