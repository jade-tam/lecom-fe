<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmDropdownAction from '$lib/components/wrapper/FormConfirmDropdownAction.svelte';
	import { courseActiveStatusOptions, type Course } from '$lib/types/Course';
	import {
		getCourseActiveStatusBadgeClass,
		getCourseActiveStatusBtnClass
	} from '$lib/utils/classComposer';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { courses }: { courses: Course[] } = $props();

	const pageSize = 6;

	const table = $derived(
		new DataTable({
			pageSize: pageSize,
			data: courses,
			columns: [
				{ id: 'courseThumbnail', key: 'courseThumbnail', name: 'Ảnh khóa học' },
				{ id: 'title', key: 'title', name: 'Tiêu đề & mô tả' },
				{ id: 'categoryName', key: 'categoryName', name: 'Danh mục' },
				{ id: 'activeStatus', key: 'active', name: 'Trạng thái' }
			]
		})
	);
</script>

<div class="my-2 flex flex-wrap items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Quản lý khóa học</h1>
		</div>
		<p class="text-base-content/60">Xem, chỉnh sửa và quản lý các sản phẩm của bạn.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<TableFilter
			name="activeStatus"
			{table}
			options={courseActiveStatusOptions}
			getFilterBtnClass={getCourseActiveStatusBtnClass}
		/>
		<SearchInput bind:value={table.globalFilter} />
		<a href="./courses/create" class="btn btn-primary">
			<span class="mr-1 icon-[fa7-solid--add]"></span>Tạo khóa học
		</a>
	</AnimatedDiv>
</div>

<AnimatedDiv animateVars={{ translateY: 16 }} class="rounded-box border bg-base-100 p-4">
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
				{#each table.rows as row (row.id)}
					<tr>
						{#each table.columns as column (column.id)}
							{#if column.id === 'activeStatus'}
								<td>
									<div class={`badge ${getCourseActiveStatusBadgeClass(row.active)}`}>
										{courseActiveStatusOptions.find((option) => option.value === row.active)?.title}
									</div>
								</td>
							{:else if column.id === 'courseThumbnail'}
								<td>
									<div>
										<Image alt="Ảnh khóa học" src={row.courseThumbnail} class="h-20 w-32" />
									</div>
								</td>
							{:else if column.id === 'title'}
								<td>
									<div class="flex flex-col">
										<p class="line-clamp-1 text-sm font-bold">{row[column.key]}</p>
										<p class="mt-1 line-clamp-2 text-xs text-base-content/60">{row.summary}</p>
									</div>
								</td>
							{:else}
								<td>{row[column.key]}</td>
							{/if}
						{/each}
						<td>
							<div class="flex justify-end gap-1">
								{#if row.active}
									<div class="tooltip" data-tip="Xem khóa học">
										<a
											href={`/learning/course/${row['slug']}`}
											class="btn btn-square btn-secondary"
											aria-label="xem khóa học"
											target="_blank"
										>
											<span class="icon-[fa7-solid--eye] text-xl"></span>
										</a>
									</div>
									<div class="tooltip" data-tip="Chỉnh sửa">
										<a
											href={`/seller/courses/update/${row.id}`}
											class="btn btn-square btn-primary"
											aria-label="chỉnh sửa"
										>
											<span class="icon-[fa7-solid--edit] text-xl"></span>
										</a>
									</div>
									<FormConfirmDropdownAction
										label="Xóa khóa học này?"
										description="Khóa học của bạn sẽ bị xóa vĩnh viễn"
										action="?/delete"
										formData={{ id: row.id }}
									>
										<div class="tooltip" data-tip="Xóa">
											<button class="btn btn-square btn-error" type="button" aria-label="xóa">
												<span class="icon-[fa7-solid--trash-alt] text-xl"></span>
											</button>
										</div>
									</FormConfirmDropdownAction>
								{/if}
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
</AnimatedDiv>
