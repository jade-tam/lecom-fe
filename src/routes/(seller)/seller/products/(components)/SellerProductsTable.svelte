<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import { approvalStatusOptions, productStatusOptions, type Product } from '$lib/types/Product';
	import {
		getApprovalStatusClass,
		getProductStatusBadgeClass,
		getProductStatusBtnClass
	} from '$lib/utils/classComposer';
	import { formatDateTime, formatVND, getTitleFromOptionList } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { products }: { products: Product[] } = $props();

	const pageSize = 12;

	const table = $derived(
		new DataTable({
			pageSize: pageSize,
			data: products,
			columns: [
				{ id: 'images', key: 'images', name: 'Ảnh' },
				{ id: 'name', key: 'name', name: 'Tên sản phẩm' },
				{ id: 'categoryName', key: 'categoryName', name: 'Danh mục' },
				{ id: 'price', key: 'price', name: 'Giá' },
				{ id: 'stock', key: 'stock', name: 'Kho' },
				{ id: 'status', key: 'status', name: 'Trạng thái' },
				{ id: 'approvalStatus', key: 'approvalStatus', name: 'Trạng thái duyệt' },
				{ id: 'lastUpdatedAt', key: 'lastUpdatedAt', name: 'Cập nhật lần cuối' }
			]
		})
	);
</script>

<div class="my-2 flex flex-wrap items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Quản lý sản phẩm</h1>
		</div>
		<p class="text-base-content/60">Xem, chỉnh sửa và quản lý các sản phẩm của bạn.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<TableFilter
			name="status"
			{table}
			options={productStatusOptions}
			getFilterBtnClass={getProductStatusBtnClass}
		/>
		<SearchInput bind:value={table.globalFilter} />
		<a href="./products/create" class="btn btn-primary">
			<span class="mr-1 icon-[fa7-solid--add]"></span>Tạo mới
		</a>
	</AnimatedDiv>
</div>

<AnimatedDiv animateVars={{ translateY: 16 }} class="rounded-box border bg-base-100 p-2">
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
					<th>Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#if table.rows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'status'}
									<td class="whitespace-nowrap"
										><div class={`badge badge-xs ${getProductStatusBadgeClass(row.status)}`}>
											{getTitleFromOptionList(row.status, productStatusOptions)}
										</div></td
									>
								{:else if column.id === 'approvalStatus'}
									<td class=" max-w-40"
										><div
											class={`badge badge-xs ${getApprovalStatusClass(row.approvalStatus, 'badge')}`}
										>
											{getTitleFromOptionList(row.approvalStatus, approvalStatusOptions)}
										</div>
										{#if row.approvalStatus === 'Rejected'}
											<p class="mt-1 text-xs font-bold text-error-content">
												Lý do: {row.moderatorNote}
											</p>
										{/if}
									</td>
								{:else if column.id === 'price'}
									<td class="font-serif text-base font-bold text-success-content"
										>{formatVND(row.price)}</td
									>
								{:else if column.id === 'name'}
									<td><p class="line-clamp-3 max-w-60 font-bold">{row.name}</p></td>
								{:else if column.id === 'stock'}
									<td
										><p class="line-clamp-3 max-w-60 text-sm font-bold text-base-content/70">
											{row.stock}
										</p></td
									>
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
									<td class="font-semibold">{formatDateTime(row['lastUpdatedAt'])}</td>
								{:else}
									<td>{row[column.key]}</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									{#if row.status === 'Published'}
										<div class="tooltip" data-tip="Xem sản phẩm">
											<a
												href={`/shopping/product/${row['slug']}`}
												class="btn btn-square btn-secondary"
												aria-label="xem chi tiết"
												target="_blank"
											>
												<span class="icon-[fa7-solid--eye] text-xl"></span>
											</a>
										</div>
									{/if}
									<div class="tooltip" data-tip="Chỉnh sửa">
										<a
											href={`/seller/products/update/${row.id}`}
											class="btn btn-square btn-primary"
											aria-label="chỉnh sửa"
										>
											<span class="icon-[fa7-solid--edit] text-xl"></span>
										</a>
									</div>
									<div class="tooltip" data-tip="Xóa">
										<FormConfirmPopoverButton
											action="?/delete"
											formData={{ id: row.id }}
											popoverId="delete-product-{row.id}"
											openButtonProps={{ class: 'btn btn-square btn-error' }}
											dropdownClass="dropdown-bottom dropdown-end"
											dropdownContent={{
												label: 'Xóa sản phẩm này?',
												description: 'Sản phẩm của bạn sẽ bị xóa vĩnh viễn',
												confirmBtnClass: 'btn-error',
												confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
												confirmBtnText: 'Xóa'
											}}
										>
											<span class="icon-[fa7-solid--trash-alt] text-xl"></span>
										</FormConfirmPopoverButton>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}
							><EmptyPlaceholder
								text="Không tìm thấy sản phẩm nào"
								description="Hãy thử thay đổi bộ lọc, tìm kiếm hoặc thêm sản phẩm mới."
							/></td
						>
					</tr>
				{/if}
			</tbody>
		</table>

		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</AnimatedDiv>
