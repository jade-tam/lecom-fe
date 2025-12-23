<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import OpenModalButton from '$lib/components/modal/OpenModalButton.svelte';
	import ReplyFeedbackModalContent from '$lib/components/modal/ReplyFeedbackModalContent.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import ImageWithFullscreenViewer from '$lib/components/ui/ImageWithFullscreenViewer.svelte';
	import SearchInput from '$lib/components/ui/SearchInput.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';
	import TablePagination from '$lib/components/ui/TablePagination.svelte';
	import { getSellerFeedbacks } from '$lib/remotes/sellerFeedbacks.remote';
	import { feedbackRatingOptions, type Feedback } from '$lib/types/Feedback';
	import { formatDate, formatDateTime } from '$lib/utils/converters';
	import { DataTable } from '@careswitch/svelte-data-table';

	const { replyFeedbackFormData }: { replyFeedbackFormData: any } = $props();

	let isLoading = $state(true);

	const pageSize = 12;

	const table = $state(
		new DataTable({
			pageSize: pageSize,
			data: [] as Feedback[],
			columns: [
				{ id: 'userName', key: 'userName', name: 'Khách hàng' },
				{ id: 'rating', key: 'rating', name: 'Đánh giá' },
				{ id: 'content', key: 'content', name: 'Nội dung đánh giá' },
				{ id: 'createdAt', key: 'createdAt', name: 'Thời gian' },
				{ id: 'reply', key: 'reply', name: 'Trả lời của shop', sortable: false }
			],
			initialSort: 'createdAt',
			initialSortDirection: 'desc'
		})
	);

	$effect(() => {
		replyFeedbackFormData;

		const loadData = async () => {
			const data = await getSellerFeedbacks();
			table.baseRows = data ? data.items : ([] as Feedback[]);
			isLoading = false;
		};

		loadData();
	});
</script>

<div class="my-2 flex flex-wrap items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-header3 font-bold">Đánh giá sản phẩm</h1>
		</div>
		<p class="text-base-content/60">Xem và quản lý đánh giá từ khách hàng về sản phẩm của bạn.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<TableFilter
			name="rating"
			{table}
			options={feedbackRatingOptions}
			getFilterBtnClass={() => 'btn-warning'}
		/>
		<SearchInput bind:value={table.globalFilter} />
	</AnimatedDiv>
</div>

<AnimatedDiv animateVars={{ translateY: 16 }} class="mt-2 rounded-box border bg-base-100 p-4">
	<div class="overflow-x-auto min-h-[70vh]">
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
				{#if isLoading}
					<tr>
						<td colspan={table.columns.length + 1}>
							<LoadingPlaceholder text="Đang tải danh sách đánh giá..." />
						</td>
					</tr>
				{:else if table.baseRows.length}
					{#each table.rows as row (row.id)}
						<tr>
							{#each table.columns as column (column.id)}
								{#if column.id === 'userName'}
									<td class="font-semibold">{row.userName}</td>
								{:else if column.id === 'rating'}
									<td>
										<div class="flex items-center gap-1">
											{#each Array(5) as _, i}
												<span
													class={`icon-[mingcute--star-fill] text-sm ${
														i < row.rating ? 'text-warning' : 'text-base-content/20'
													}`}
												></span>
											{/each}
										</div>
									</td>
								{:else if column.id === 'content'}
									<td>
										<div class="flex flex-col gap-2">
											<p class="text-sm">{row.content}</p>
											{#if row.images && row.images.length > 0}
												<div class="flex flex-wrap gap-1">
													{#each row.images as image}
														<ImageWithFullscreenViewer
															src={image}
															class="h-12 w-12 rounded object-cover"
														/>
													{/each}
												</div>
											{/if}
										</div>
									</td>
								{:else if column.id === 'createdAt'}
									<td class="font-semibold">{formatDateTime(row.createdAt)}</td>
								{:else if column.id === 'reply'}
									<td>
										{#if row.reply}
											<div class="text-base-content">{row.reply?.content}</div>
										{:else}
											<div class="text-warning-content italic">Chưa trả lời đánh giá</div>
										{/if}
									</td>
								{:else}
									<td>{row[column.key] ?? '-'}</td>
								{/if}
							{/each}
							<td>
								<div class="flex gap-1">
									<div class="tooltip" data-tip="Chỉnh sửa">
										{#if row.reply}
											<OpenModalButton
												openButtonProps={{ class: 'btn btn-secondary' }}
												ModalContent={ReplyFeedbackModalContent}
												ModalContentProps={{
													dataForm: replyFeedbackFormData,
													feedback: row,
													type: 'update'
												}}
											>
												<span class="icon-[mingcute--edit-4-line] text-lg"></span>Chỉnh sửa
											</OpenModalButton>
										{:else}
											<OpenModalButton
												openButtonProps={{ class: 'btn btn-primary' }}
												ModalContent={ReplyFeedbackModalContent}
												ModalContentProps={{
													dataForm: replyFeedbackFormData,
													feedback: row,
													type: 'create'
												}}
											>
												<span class="icon-[mingcute--chat-1-line] text-lg"></span>Trả lời
											</OpenModalButton>
										{/if}
									</div>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan={table.columns.length + 1}>
							<EmptyPlaceholder text="Không có đánh giá nào để hiển thị." />
						</td>
					</tr>
				{/if}
			</tbody>
		</table>

		<div class="flex justify-end overflow-hidden">
			<TablePagination {table} {pageSize} />
		</div>
	</div>
</AnimatedDiv>
