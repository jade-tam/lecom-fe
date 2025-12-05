<script>
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import CommunityPostCard from './(commponents)/CommunityPostCard.svelte';

	const { data } = $props();
</script>

<div class="my-2 flex flex-wrap items-end justify-between gap-2">
	<AnimatedDiv animateVars={{ translateX: -20 }} class="flex flex-col">
		<div class="flex items-center gap-2">
			<h1 class="text-header3 font-bold">Cộng đồng</h1>
		</div>
		<p class="text-base-content/60">
			Khám phá và thảo luận các đề tài với các thành viên khác trong cộng đồng LECOM.
		</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		<a href={resolve('/(authenticated)/community/create-post')} class="btn btn-primary">
			<span class="icon-[mingcute--add-square-line] text-xl"></span>Tạo bài viết mới</a
		>
	</AnimatedDiv>
</div>

{#await data.communityPostsPromise}
	<LoadingPlaceholder text="Đang tải danh sách bài viết cộng đồng..." class="mt-8" />
{:then communityPosts}
	{#if communityPosts.length}
		<div class="w-full columns-2 gap-4 max-md:columns-1">
			{#each communityPosts as post (post.id)}
				<CommunityPostCard {post} />
			{/each}
		</div>
	{:else}
		<EmptyPlaceholder text="Chưa có bài viết nào trong cộng đồng" class="mt-8" />
	{/if}
{:catch err}
	<p class="text-error">Có lỗi xảy ra trong khi đang tải bài viết cộng đồng</p>
{/await}
