<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import TipTapRichTextEditor from '$lib/components/ui/data-input/TipTapRichTextEditor.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import type { CommunityPost } from '$lib/types/CommunityPost';
	import { formatDateTime } from '$lib/utils/converters';
	import { slide } from 'svelte/transition';

	const { post, index, isViewOnly }: { post: CommunityPost; index?: number; isViewOnly?: boolean } =
		$props();

	let isCommentOpen = $state(false);
	let liked = $state(false);
	let likeCount = $state(0); // You can set this from post.likes if available
	// let dataForm = $state(null);
	// let form: SuperForm<CreateCommentSchema, { toastData: ToastData }> | null = $derived.by(() => {
	// 	if (dataForm) {
	// 		return superForm(dataForm, {
	// 			id: 'comment-form-' + post.id,
	// 			validators: zod4Client(createCommentSchema)
	// 		});
	// 	}

	// 	return null;
	// });

	// // On component mount, create the form
	// onMount(async () => {
	// 	dataForm = await superValidate(zod4(createCommentSchema));
	// });

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
	class="mb-4 break-inside-avoid rounded-box border bg-base-100 p-4 shadow-sm"
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
					<span class="ml-1 badge badge-sm px-1 badge-error">{likeCount}</span>
				{/if}
			</button>
			<button class="btn" type="button" aria-label="Bình luận" onclick={handleCommentToggle}>
				<span class="icon-[mingcute--comment-line]"></span>
				<span>Bình luận</span>
				{#if post.comments?.length}
					<span class="ml-1 badge badge-sm px-1 badge-secondary">{post.comments.length}</span>
				{/if}
			</button>
		</div>
	{/if}

	<!-- Comments Section -->
	{#if isCommentOpen && !isViewOnly}
		<div class="mt-4" transition:slide={{ duration: 200 }}>
			<!-- {#if form !== null}
				<form use:enhance={form.enhance} class="mb-4 space-y-2">

					<div class="mb-4">
						<FormInput
							placeholder="Viết bình luận..."
							class="w-full"
							superForm={form.form}
							name="body"
							errors={form.errors}
						/>
						<button class="btn mt-2 btn-sm btn-primary" type="button">Gửi</button>
					</div>
				</form>
			{/if} -->

			<!-- Existing Comments -->
			{#if post.comments?.length}
				<div class="space-y-4">
					{#each post.comments as comment}
						<div class="flex items-start gap-3">
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
			{:else}
				<p class="text-sm text-base-content/60 italic">Chưa có bình luận nào.</p>
			{/if}
		</div>
	{/if}
</AnimatedDiv>
