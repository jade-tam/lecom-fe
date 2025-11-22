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
			{ id: 'shopAvatar', key: 'shopAvatar', name: 'Ảnh đại diện' },
			{ id: 'name', key: 'name', name: 'Tên cửa hàng' },
			{ id: 'ownerFullName', key: 'ownerFullName', name: 'Chủ cửa hàng' },
			{ id: 'phoneNumber', key: 'phoneNumber', name: 'Số điện thoại' },
			{ id: 'businessType', key: 'businessType', name: 'Loại hình kinh doanh' },
			{ id: 'categoryName', key: 'categoryName', name: 'Danh mục' },
			{ id: 'status', key: 'status', name: 'Trạng thái' }
		]
	});
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Quản lý cửa hàng</h1>
		<p class="text-base-content/60">Xem thông tin chi tiết và xét duyệt các cửa hàng trên nền tảng.</p>
	</div>

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

					<th>Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'status'}
								<td>
									<div class={`badge ${getStatusBadgeClass(row.status)}`}>
										{row[column.key]}
									</div>
								</td>
							{:else if column.id === 'shopAvatar'}
								<td>
									<Image src={row.shopAvatar} class="h-12 w-12" alt="avatar" />
								</td>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
						<td>
							<a
								href={`/admin/shops-management/${row.id}`}
								class="btn {row.status === 'Pending' ? 'btn-primary' : 'btn-secondary'}"
								aria-label="xem chi tiết"
							>
								<span
									class="{row.status === 'Pending'
										? 'icon-[fa7-solid--vote-yea]'
										: 'icon-[fa7-solid--eye]'} text-xl"
								></span>{row.status === 'Pending' ? 'Xét duyệt' : 'Chi tiết'}
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
