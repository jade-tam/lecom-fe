<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import ModeratorViewCourseLessonModalContent from '$lib/components/modal/ModeratorViewCourseLessonModalContent.svelte';
	import OpenModalButton from '$lib/components/modal/OpenModalButton.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import FormRejectWithReasonPopoverButton from '$lib/components/wrapper/FormRejectWithReasonPopoverButton.svelte';
	import { type ModeratorPendingLesson } from '$lib/types/Course';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { lessons }: { lessons: ModeratorPendingLesson[] } = $props();

	const pageSize = 12;

	const table = $derived(
		new DataTable({
			pageSize: pageSize,
			data: lessons,
			columns: [
				{ id: 'title', key: 'title', name: 'Tiêu đề bài học' },
				{ id: 'sectionTitle', key: 'sectionTitle', name: 'Thuộc chương học' },
				{ id: 'courseTitle', key: 'courseTitle', name: 'Thuộc khóa học' }
			]
		})
	);
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<h1 class="text-header3 font-bold">Bài học chờ duyệt</h1>
		<p class="text-base-content/60">
			Xem thông tin bài học và thực hiện thao tác duyệt hoặc từ chối.
		</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }}>
		<SearchInput bind:value={table.globalFilter} />
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
					<th class="text-right">Thao tác</th>
				</tr>
			</thead>
			<tbody>
				{#if table.rows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'title'}
									<td>
										<p class="text-sm font-bold">{row[column.key]}</p>
									</td>
								{:else}
									<td><p class="font-semibold text-base-content/70">{row[column.key]}</p></td>
								{/if}
							{/each}
							<td>
								<div class="flex justify-end gap-1 p-1">
									<div class="tooltip tooltip-top" data-tip="Xem chi tiết">
										<OpenModalButton
											openButtonProps={{ class: 'btn btn-square btn-primary' }}
											ModalContent={ModeratorViewCourseLessonModalContent}
											ModalContentProps={{ lessonId: row.id }}
										>
											<span class="icon-[mingcute--document-3-line] text-lg"></span>
										</OpenModalButton>
									</div>
									<div class="tooltip tooltip-top" data-tip="Chấp thuận">
										<FormConfirmPopoverButton
											action="?/approve"
											formData={{ id: row.id }}
											popoverId="approve-lesson-{row.id}"
											openButtonProps={{ class: 'btn btn-square btn-success' }}
											dropdownClass="dropdown-bottom dropdown-end"
											dropdownContent={{
												label: 'Chấp thuận bài học này?',
												description: 'Bài học sẽ được hiển thị trên khóa học của người bán.',
												confirmBtnClass: 'btn-success',
												confirmBtnIcon: 'icon-[fa7-solid--check-square]',
												confirmBtnText: 'Chấp thuận'
											}}
										>
											<span class="icon-[mingcute--check-circle-line] text-xl"></span>
										</FormConfirmPopoverButton>
									</div>
									<div class="tooltip tooltip-top" data-tip="Từ chối">
										<!-- <FormConfirmPopoverButton
											action="?/reject"
											formData={{ id: row.id }}
											popoverId="reject-lesson-{row.id}"
											openButtonProps={{ class: 'btn btn-square btn-error' }}
											dropdownClass="dropdown-bottom dropdown-end"
											dropdownContent={{
												label: 'Từ chối bài học này?',
												description: 'Bài học sẽ không được hiển thị.',
												confirmBtnClass: 'btn-error',
												confirmBtnIcon: 'icon-[fa7-solid--xmark-square]',
												confirmBtnText: 'Từ chối'
											}}
										>
											<span class="icon-[fa7-solid--xmark-square] text-xl"></span>
										</FormConfirmPopoverButton> -->
										<FormRejectWithReasonPopoverButton
											popoverId="reject-lesson-popover-{row.id}"
											action="?/reject"
											openButtonProps={{ class: 'btn btn-square btn-error' }}
											formData={{
												id: row.id
											}}
											dropdownClass="dropdown-bottom dropdown-end"
											dropdownContent={{
												label: 'Từ chối bài học này?',
												description: 'Bài học sẽ không được hiển thị.',
												confirmBtnClass: 'btn-error',
												confirmBtnIcon: 'icon-[fa7-solid--xmark-square]',
												confirmBtnText: 'Từ chối'
											}}
										>
											<span class="icon-[mingcute--close-circle-line] text-xl"></span>
										</FormRejectWithReasonPopoverButton>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder
								text="Không có bài học chờ duyệt."
								description="Tất cả bài học đã được kiểm duyệt."
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
</AnimatedDiv>
