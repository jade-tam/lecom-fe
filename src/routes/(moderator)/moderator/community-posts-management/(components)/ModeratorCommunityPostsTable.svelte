<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import TipTapRichTextEditor from '$lib/components/ui/data-input/TipTapRichTextEditor.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import FormConfirmPopoverButton from '$lib/components/wrapper/FormConfirmPopoverButton.svelte';
	import type { ModeratorPendingCommunityPost } from '$lib/types/CommunityPost';
	import { formatDateTime } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const {
		moderatorPendingCommunityPostsPromise
	}: { moderatorPendingCommunityPostsPromise: Promise<ModeratorPendingCommunityPost[]> } = $props();

	const pageSize = 4;
	let isLoading = $state(true);

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as ModeratorPendingCommunityPost[],
			columns: [
				{ id: 'title', key: 'title', name: 'Tiêu đề' },
				{ id: 'userName', key: 'userName', name: 'Tác giả' },
				{ id: 'body', key: 'body', name: 'Nội dung' },
				{ id: 'createdAt', key: 'createdAt', name: 'Thời gian tạo' }
			]
		})
	);

	$effect(() => {
		const setPosts = async () => {
			const posts = await moderatorPendingCommunityPostsPromise;
			table.baseRows = posts;
			isLoading = false;
		};
		setPosts();
	});
</script>

<div class="my-2 flex items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<h1 class="text-header3 font-bold">Bài viết cộng đồng chờ duyệt</h1>
		<p class="text-base-content/60">
			Xem thông tin bài viết và thực hiện thao tác duyệt hoặc từ chối.
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
				{#if isLoading}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder text="Đang tải danh sách bài viết..." />
						</td>
					</tr>
				{:else if table.rows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'body'}
									<td>
										<TipTapRichTextEditor content={row.body} editable={false} />
									</td>
								{:else if column.id === 'createdAt'}
									<td>
										<span class="text-xs font-semibold">{formatDateTime(row.createdAt)}</span>
									</td>
								{:else if column.id === 'userName'}
									<td>
										<span class="text-xs font-bold">{row.userName}</span>
									</td>
								{:else if column.id === 'title'}
									<td class="max-w-32">
										<span class="font-serif text-base font-bold">{row.title}</span>
									</td>
								{:else}
									<td>{row[column.key]}</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									<div class="tooltip tooltip-top" data-tip="Chấp thuận">
										<FormConfirmPopoverButton
											action="?/approve"
											formData={{ id: row.id }}
											popoverId={`approve-post-${row.id}`}
											openButtonProps={{
												class: 'btn btn-success btn-square',
												'aria-label': 'approve'
											}}
											dropdownContent={{
												label: 'Chấp thuận bài viết này?',
												description: 'Bài viết sẽ được hiển thị cho cộng đồng.',
												confirmBtnClass: 'btn-success',
												confirmBtnIcon: 'icon-[mingcute--checkbox-line]',
												confirmBtnText: 'Chấp thuận'
											}}
										>
											<span class="icon-[mingcute--checkbox-line] text-xl"></span>
										</FormConfirmPopoverButton>
									</div>
									<div class="tooltip tooltip-top" data-tip="Từ chối">
										<FormConfirmPopoverButton
											action="?/reject"
											formData={{ id: row.id }}
											popoverId={`reject-post-${row.id}`}
											openButtonProps={{
												class: 'btn btn-error btn-square',
												'aria-label': 'reject'
											}}
											dropdownContent={{
												label: 'Từ chối bài viết này?',
												description: 'Bài viết sẽ không được hiển thị.',
												confirmBtnClass: 'btn-error',
												confirmBtnIcon: 'icon-[mingcute--close-square-line]',
												confirmBtnText: 'Từ chối'
											}}
										>
											<span class="icon-[mingcute--close-square-line] text-xl"></span>
										</FormConfirmPopoverButton>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder
								text="Không có bài viết chờ duyệt."
								description="Tất cả bài viết đã được kiểm duyệt."
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
