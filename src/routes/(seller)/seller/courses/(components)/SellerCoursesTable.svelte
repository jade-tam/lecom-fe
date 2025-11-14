<script lang="ts">
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
				{ id: 'courseThumbnail', key: 'courseThumbnail', name: 'Course Thumbnail' },
				{ id: 'title', key: 'title', name: 'Title & Summary' },
				{ id: 'categoryName', key: 'categoryName', name: 'Category' },
				{ id: 'activeStatus', key: 'active', name: 'Active status' }
			]
		})
	);
</script>

<div class="my-2 flex items-end justify-between">
	<div class="flex flex-col">
		<h1 class="text-header3 font-bold">Courses</h1>
		<p class="text-base-content/60">View, edit, and manage your courses.</p>
	</div>

	<div class="flex gap-2">
		<TableFilter
			name="activeStatus"
			{table}
			options={courseActiveStatusOptions}
			getFilterBtnClass={getCourseActiveStatusBtnClass}
		/>
		<SearchInput bind:value={table.globalFilter} />
		<a href="./courses/create" class="btn btn-primary">
			<span class="mr-1 icon-[fa7-solid--add]"></span>Create Course
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
										{:else}{/if}
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
							{#if column.id === 'activeStatus'}
								<td
									><div class={`badge ${getCourseActiveStatusBadgeClass(row.active)}`}>
										{courseActiveStatusOptions.find((option) => option.value === row.active)?.title}
									</div></td
								>
							{:else if column.id === 'courseThumbnail'}
								<td
									><div>
										<Image alt="product" src={row.courseThumbnail} class="h-20 w-32" />
									</div>
								</td>
							{:else if column.id === 'title'}
								<td
									><div class="flex flex-col">
										<p class="line-clamp-1">{row[column.key]}</p>
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
									<div class="tooltip" data-tip="View course">
										<a
											href={`/learning/course/${row['slug']}`}
											class="btn btn-square btn-secondary"
											aria-label="view course"
											target="_blank"
										>
											<span class="icon-[fa7-solid--eye] text-xl"></span>
										</a>
									</div>
									<div class="tooltip" data-tip="Update">
										<a
											href={`/seller/courses/update/${row.id}`}
											class="btn btn-square btn-primary"
											aria-label="update"
										>
											<span class="icon-[fa7-solid--edit] text-xl"></span>
										</a>
									</div>
									<FormConfirmDropdownAction
										label="Delete this course?"
										description="Your course will be deleted forever"
										action="?/delete"
										formData={{ id: row.id }}
									>
										<div class="tooltip" data-tip="Delete">
											<button class="btn btn-square btn-error" type="button" aria-label="delete">
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
</div>
