<script lang="ts">
	import type { FeedbackSummary } from '$lib/types/Feedback';
	import { formatDateTime } from '$lib/utils/converters';
	import Rating from '../data-input/Rating.svelte';
	import EmptyPlaceholder from '../EmptyPlaceholder.svelte';
	import ImageWithFullscreenViewer from '../ImageWithFullscreenViewer.svelte';

	const {
		feedbackSummaryPromise
	}: {
		feedbackSummaryPromise: Promise<FeedbackSummary | null>;
	} = $props();

	let feedbackSummary: FeedbackSummary | null = $state(null);
	let isLoading: boolean = $state(true);

	$effect(() => {
		const setfeedbackSummary = async () => {
			const data = await feedbackSummaryPromise;
			feedbackSummary = data;
			isLoading = false;
		};

		setfeedbackSummary();
	});
</script>

<div class="col-span-12 rounded-box border bg-base-100 p-4 max-md:col-span-1 max-md:p-4">
	<p class="text-header3">Đánh giá sản phẩm</p>

	{#if isLoading}
		<div class="mt-4 space-y-4">
			<div class="h-32 skeleton rounded-box"></div>
			<div class="h-64 skeleton rounded-box"></div>
		</div>
	{:else if feedbackSummary}
		<!-- Rating Summary -->
		<div class="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1">
			<!-- Average Rating Card -->
			<div class="rounded-box border bg-primary/10 p-4">
				<p class="text-sm text-base-content/70">Đánh giá trung bình</p>
				<div class="flex items-center gap-4">
					<div class="text-header1 font-serif font-bold text-primary-content">
						{feedbackSummary.averageRating.toFixed(1)}
					</div>
					<div class="flex flex-col gap-1">
						<Rating defaultValue={feedbackSummary.averageRating} readonly={true} />
						<p class="text-xs text-base-content/60">
							<strong>{feedbackSummary.totalFeedbackCount}</strong> lượt đánh giá
						</p>
					</div>
				</div>
			</div>

			<!-- Positive Rate Card -->
			<div class="rounded-box border bg-success/10 p-4">
				<p class="text-sm text-base-content/70">Tỉ lệ tích cực</p>
				<div class="flex items-center gap-2">
					<div class="text-header1 font-serif font-bold text-success-content">
						{feedbackSummary.positiveRate.toFixed(1)}%
					</div>
					<p class="text-xs text-base-content/60">
						Dựa trên {feedbackSummary.totalFeedbackCount} đánh giá
					</p>
				</div>
			</div>
		</div>

		<!-- Rating Breakdown -->
		<div class="mt-4">
			<p class="mb-2 font-bold">Lọc theo đánh giá</p>
			<form class="filter">
				<input class="btn btn-square btn-sm" type="reset" value="×" />
				{#each [5, 4, 3, 2, 1] as rating}
					{@const count = (feedbackSummary as unknown as Record)[`rating${rating}Count`]}
					<input
						type="radio"
						aria-label={`${rating} sao (${count})`}
						class="btn btn-sm"
						name="rating-filter"
					/>
				{/each}
			</form>
		</div>

		<!-- Recent Feedbacks -->
		{#if feedbackSummary.recentFeedbacks.length > 0}
			<div class="mt-6 space-y-2">
				<p class="font-bold">Đánh giá gần đây</p>
				{#each feedbackSummary.recentFeedbacks as feedback}
					<div class="rounded-box border bg-base-200/30 p-4">
						<!-- User Info -->
						<div class="mb-3 flex items-center gap-3">
							<img
								src={feedback.userAvatar}
								alt={feedback.userName}
								class="h-10 w-10 rounded-full object-cover"
							/>
							<div class="flex-1">
								<p class="text-sm font-semibold">{feedback.userName}</p>
								<p class="text-xs text-base-content/60">
									Đánh giá lúc {formatDateTime(feedback.createdAt)}
								</p>
							</div>
							<Rating defaultValue={feedback.rating} readonly={true} />
						</div>

						<!-- Feedback Content -->
						<p class="text-sm text-base-content">{feedback.content}</p>

						<!-- Feedback Images -->
						{#if feedback.images && feedback.images.length > 0}
							<div class="mt-3 flex gap-2">
								{#each feedback.images as image}
									<ImageWithFullscreenViewer src={image} alt="feedback" class="h-20 w-20" />
								{/each}
							</div>
						{/if}

						<!-- Reply -->
						{#if feedback.reply}
							<div class="mt-3 rounded-box border-l-4 border-primary bg-primary/10 p-3">
								<p class="text-xs font-semibold text-primary">Trả lời từ cửa hàng:</p>
								<p class="mt-1 text-sm text-base-content">{feedback.reply}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<EmptyPlaceholder text="Chưa có đánh giá cho sản phẩm này." />
		{/if}
	{:else}
		<div class="mt-4 flex flex-col items-center justify-center py-8">
			<span class="icon-[mingcute--star-line] text-4xl text-base-content/30"></span>
			<p class="mt-2 text-base-content/60">Chưa có đánh giá cho sản phẩm này</p>
		</div>
	{/if}
</div>
