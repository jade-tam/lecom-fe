<script lang="ts">
	import { getLessonDetailForModerator } from '$lib/remotes/sellerCourse.remote';
	import showToast from '$lib/utils/showToast';
	import EmptyPlaceholder from '../ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '../ui/skeleton/LoadingPlaceholder.svelte';

	import type { ModeratorPendingLessonDetail } from '$lib/types/Course';
	import { getApprovalStatusClass } from '$lib/utils/classComposer';
	import { getTitleFromOptionList } from '$lib/utils/converters';
	import { approvalStatusOptions } from '$lib/types/Product';

	const {
		onFormActionSuccess,
		lessonId
	}: {
		onFormActionSuccess?: () => void;
		lessonId: string;
	} = $props();
</script>

<h3>Chi tiết nội dung bài học</h3>
<p class="mt-2 text-sm text-base-content/70">
	Kiểm tra chi tiết nội dung bài học dưới đây trước khi duyệt.
</p>

{#await getLessonDetailForModerator(lessonId)}
	<LoadingPlaceholder text="Đang tải chi tiết bài học" />
{:then lessonDetail: ModeratorPendingLessonDetail | null}
	{#if lessonDetail}
		<div class="mt-2 space-y-4 rounded-box bg-base-200 p-4">
			<!-- Lesson title -->
			<div>
				<h4 class="text-base font-bold">Tên bài học</h4>
				<p class="mt-1 text-sm font-bold text-primary-content">
					{lessonDetail.title}
				</p>
			</div>

			<!-- Section info -->
			<div>
				<h4 class="text-base font-bold">Thuộc chương học</h4>
				<p class="mt-1 font-bold text-primary-content">{lessonDetail.section.title}</p>
			</div>

			<!-- Course info -->
			<div>
				<h4 class="text-base font-bold">Nằm trong khoá học</h4>
				<p class="mt-1 font-bold text-primary-content">{lessonDetail.course.title}</p>
				<p class="text-xs text-base-content/60">
					Slug: {lessonDetail.course.slug}
				</p>
			</div>

			<!-- Lesson metadata -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<h4 class="text-base font-bold">Loại bài học</h4>
					<p class="mt-1">{lessonDetail.type}</p>
				</div>

				<div>
					<h4 class="text-base font-bold">Thứ tự trong chương</h4>
					<p class="mt-1">{lessonDetail.orderIndex}</p>
				</div>

				<div>
					<h4 class="text-base font-bold">Thời lượng</h4>
					<p class="mt-1">{lessonDetail.durationSeconds} giây</p>
				</div>

				<div>
					<h4 class="text-base font-bold">Trạng thái duyệt</h4>
					<div
						class="mt-1 badge badge-sm {getApprovalStatusClass(
							lessonDetail.approvalStatus,
							'badge'
						)}"
					>
						{getTitleFromOptionList(lessonDetail.approvalStatus, approvalStatusOptions)}
					</div>
				</div>
			</div>

			<!-- Moderator note -->
			<div>
				<h4 class="mb-1 text-base font-bold">Ghi chú của kiểm duyệt</h4>
				{#if lessonDetail.moderatorNote}
					<p class="text-warning-content">
						{lessonDetail.moderatorNote}
					</p>
				{:else}
					<p class="text-base-content/50 italic">Chưa có ghi chú</p>
				{/if}
			</div>

			<!-- Lesson content -->
			<div>
				<h4 class="text-base font-bold">Nội dung</h4>

				{#if lessonDetail.type === 'Video'}
					<video
						class="mt-2 aspect-video w-full rounded-field bg-base-300"
						controls
						src={lessonDetail.contentUrl}
					></video>
				{:else if lessonDetail.type === 'Quiz'}
					<p class="mt-2 text-base-content/70 italic">Bài học dạng Quiz</p>
				{/if}
			</div>
		</div>
	{:else}
		<EmptyPlaceholder text="Không thể tải chi tiết bài học." />
	{/if}
{:catch}
	<div
		{@attach showToast({
			type: 'error',
			title: 'Đã xảy ra lỗi khi tải chi tiết bài học.'
		})}
	></div>
	<EmptyPlaceholder text="Đã xảy ra lỗi khi tải chi tiết bài học." />
{/await}
