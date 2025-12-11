<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import TipTapRichTextEditor from '$lib/components/ui/data-input/TipTapRichTextEditor.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { createCommentSchema, type CreateCommentSchema } from '$lib/schemas/communityPostSchema';
	import type { CommunityPost } from '$lib/types/CommunityPost';
	import { formatDateTime } from '$lib/utils/converters';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const {
		post,
		index,
		isViewOnly
	}: { post: CommunityPost & { form?: any }; index?: number; isViewOnly?: boolean } = $props();

	let isCommentOpen = $state(false);
	let liked = $state(false);
	let likeCount = $state(0);
	let showAllComments = $state(false);

	const { form, errors, message, enhance, submitting, delayed, tainted, isTainted, submit } =
		superForm<
			CreateCommentSchema,
			{
				toastData: ToastData;
			}
		>(post.form, {
			validators: zod4Client(createCommentSchema)
		});

	$effect(() => {
		if ($message?.toastData) {
			if ($message.toastData.type !== 'success') {
				showToast($message.toastData);
			}
		}
	});

	function handleLike() {
		liked = !liked;
		likeCount += liked ? 1 : -1;
	}

	function handleCommentToggle() {
		isCommentOpen = !isCommentOpen;
	}
</script>

<AnimatedDiv
	animateVars={{ translateY: 16, delay: (index ?? 0) * 100 }}
	class="mb-4 break-inside-avoid-column rounded-box border bg-base-100 p-4 shadow-sm"
>
	<!-- Author Info -->
	<div class="mb-2 flex items-center gap-3">
		<Image
			src={post.user.avatar}
			alt={post.user.userName}
			class="h-12 w-12 rounded-full object-cover"
		/>
		<div>
			<p class="font-bold">{post.user.userName}</p>
			<p class="text-xs text-base-content/60">Đăng lúc {formatDateTime(post.createdAt)}</p>
		</div>
	</div>

	<!-- Post Content -->
	<div>
		<h2 class="mb-1 text-lg font-semibold">{post.title}</h2>
		<TipTapRichTextEditor content={post.body} editable={false} />
	</div>

	<div class="divider my-1"></div>

	<!-- Actions -->
	{#if !isViewOnly}
		<div class="flex items-center gap-2">
			<button
				class="btn {liked ? 'btn-error' : ''}"
				type="button"
				aria-label="Thích"
				onclick={handleLike}
			>
				<span class={liked ? 'icon-[mingcute--heart-fill]' : 'icon-[mingcute--heart-line]'}></span>
				<span>Thích</span>
				{#if likeCount > 0}
					<span class="ml-1 badge px-1 badge-sm badge-error">{likeCount}</span>
				{/if}
			</button>
			<button class="btn" type="button" aria-label="Bình luận" onclick={handleCommentToggle}>
				<span class="icon-[mingcute--comment-line]"></span>
				<span>Bình luận</span>
				{#if post.comments?.length}
					<span class="ml-1 badge px-1 badge-sm badge-secondary">{post.comments.length}</span>
				{/if}
			</button>
		</div>
	{/if}

	<!-- Comments Section -->
	{#if isCommentOpen && !isViewOnly}
		<div class="mt-2" transition:slide={{ duration: 200 }}>
			<form use:enhance action="?/createComment" method="POST">
				<div class="flex items-center gap-2">
					<FormInput
						placeholder="Viết bình luận..."
						class="w-full grow"
						superForm={form}
						name="body"
						{errors}
						hideError
					/>
					<button class="btn btn-primary" type="submit"
						><span class="icon-[mingcute--send-line] text-xl"></span>Gửi</button
					>
				</div>
				<FormInput
					placeholder="ID bài viết"
					defaultValue={post.id}
					superForm={form}
					name="postId"
					hidden
					{errors}
				/>
			</form>
		</div>
	{/if}

	<div class="mt-4">
		<!-- Existing Comments -->
		{#if post.comments?.length}
			<div class="max-h-82 space-y-4 overflow-y-auto">
				{#each post.comments.slice(0, showAllComments ? undefined : 2) as comment}
					<div class="flex items-start gap-3" transition:slide={{ duration: 200 }}>
						<Image
							src={comment.user.avatar}
							alt={comment.user.userName}
							class="h-10 w-10 rounded-full object-cover"
						/>
						<div>
							<p class="text-sm font-bold">
								{comment.user.userName}<span class="ml-2 text-xs font-light text-base-content/60">
									Bình luận lúc {formatDateTime(comment.createdAt)}
								</span>
							</p>
							<p class="text-sm">{comment.body}</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- See More Comments Button -->
			{#if post.comments.length > 2 && !showAllComments}
				<button class="btn mt-3 w-full btn-ghost btn-sm" onclick={() => (showAllComments = true)}>
					<span class="icon-[mingcute--down-line]"></span>
					Xem thêm {post.comments.length - 2} bình luận
				</button>
			{:else if showAllComments && post.comments.length > 2}
				<button class="btn mt-3 w-full btn-ghost btn-sm" onclick={() => (showAllComments = false)}>
					<span class="icon-[mingcute--up-line]"></span>
					Ẩn bình luận
				</button>
			{/if}
		{:else}
			<p class="text-sm text-base-content/60 italic">Chưa có bình luận nào.</p>
		{/if}
	</div>
</AnimatedDiv>
