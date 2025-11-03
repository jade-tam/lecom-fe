<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { productStatusOptions, type Product } from '$lib/types/Product';
	import { getProductStatusBadgeClass, getProductStatusBtnClass } from '$lib/utils/classComposer';
	import { formatDate, formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { products }: { products: Product[] } = $props();

	const pageSize = 12;

	const table = new DataTable({
		pageSize: pageSize,
		data: products,
		columns: [
			{ id: 'images', key: 'images', name: 'Image' },
			{ id: 'name', key: 'name', name: 'Name' },
			{ id: 'categoryName', key: 'categoryName', name: 'Category' },
			{ id: 'price', key: 'price', name: 'Price' },
			{ id: 'stock', key: 'stock', name: 'Stock' },
			{ id: 'status', key: 'status', name: 'Status' },
			{ id: 'lastUpdatedAt', key: 'lastUpdatedAt', name: 'Last Updated' }
		]
	});
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Products</h1>
		<p class="text-base-content/60">View, edit, and manage your products.</p>
	</div>

	<div class="flex gap-2">
		<TableFilter
			name="status"
			{table}
			options={productStatusOptions}
			getFilterBtnClass={getProductStatusBtnClass}
		/>
		<SearchInput bind:value={table.globalFilter} />
		<a href="./products/create" class="btn btn-primary">
			<span class="mr-1 icon-[fa7-solid--add]"></span>Create Product
		</a>
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
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'status'}
								<td
									><div class={`badge ${getProductStatusBadgeClass(row.status)}`}>
										{row.status}
									</div></td
								>
							{:else if column.id === 'price'}
								<td>{formatVND(row.price)}</td>
							{:else if column.id === 'images'}
								<td
									><div>
										<Image
											alt="product"
											class="h-16 w-16"
											src={row['images'].find((img) => img.isPrimary)?.url}
										/>
									</div>
								</td>
							{:else if column.id === 'lastUpdatedAt'}
								<td>{formatDate(row['lastUpdatedAt'])}</td>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
						<td>
							<div class="flex gap-1">
								<div class="tooltip" data-tip="View product">
									<a
										href={`/shopping/product/${row['slug']}`}
										class="btn btn-square btn-secondary"
										aria-label="view details"
										target="_blank"
									>
										<span class="icon-[fa7-solid--eye] text-xl"></span>
									</a>
								</div>
								<div class="tooltip" data-tip="Update">
									<a
										href={`/seller/products/update/${row.id}`}
										class="btn btn-square btn-primary"
										aria-label="edit"
									>
										<span class="icon-[fa7-solid--edit] text-xl"></span>
									</a>
								</div>
								<FormConfirmDropdownAction
									label="Delete this product?"
									description="Your product will be deleted forever"
									action="?/delete"
									formData={{ id: row.id }}
								>
									<div class="tooltip" data-tip="Delete">
										<button class="btn btn-square btn-error" type="button" aria-label="delete">
											<span class="icon-[fa7-solid--trash-alt] text-xl"></span>
										</button>
									</div>
								</FormConfirmDropdownAction>
							</div>
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
