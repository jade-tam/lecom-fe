<script lang="ts">
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { type Course } from '$lib/types/Course';
	import { formatVND } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { courses }: { courses: Course[] } = $props();

	const pageSize = 12;

	const table = $derived(
		new DataTable({
			pageSize: pageSize,
			data: courses,
			columns: [
				{ id: 'title', key: 'title', name: 'Tiêu đề' },
				{ id: 'slug', key: 'slug', name: 'Slug' },
				{ id: 'shopName', key: 'shopName', name: 'Tên cửa hàng' }
			]
		})
	);
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Khóa học chờ duyệt</h1>
		<p class="text-base-content/60">
			Xem thông tin khóa học và thực hiện thao tác duyệt hoặc từ chối.
		</p>
	</div>

	<div class="flex gap-2">
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
					<th class="text-right">Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#if table.rows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								<td>{row[column.key]}</td>
							{/each}
							<td>
								<div class="flex justify-end gap-1">
									<FormConfirmDropdownAction
										label="Chấp thuận khóa học này?"
										description="Khóa học sẽ được hiển thị trên cửa hàng của người bán cũng như trang mua sắm."
										action="?/approve"
										formData={{ id: row.id }}
										confirmButtonClass="btn-success"
										confirmButtonIcon="icon-[fa7-solid--check-square]"
									>
										<div class="tooltip tooltip-top" data-tip="Chấp thuận">
											<button class="btn btn-success" type="button" aria-label="approve">
												<span class="icon-[fa7-solid--check-square] text-xl"></span>Chấp thuận
											</button>
										</div>
									</FormConfirmDropdownAction>
									<FormConfirmDropdownAction
										label="Từ chối khóa học này?"
										description="Khóa học sẽ không được hiển thị."
										action="?/reject"
										formData={{ id: row.id }}
										confirmButtonClass="btn-error"
										confirmButtonIcon="icon-[fa7-solid--xmark-square]"
									>
										<div class="tooltip tooltip-top" data-tip="Từ chối">
											<button class="btn btn-error" type="button" aria-label="reject">
												<span class="icon-[fa7-solid--xmark-square] text-xl"></span>Từ chối
											</button>
										</div>
									</FormConfirmDropdownAction>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder
								text="Không có khóa học chờ duyệt."
								description="Tất cả khóa học đã được kiểm duyệt."
							/>
						</td>
					</tr>
				{/if}
			</tbody>
		</table>

		<div class="flex justify-end">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</div>
