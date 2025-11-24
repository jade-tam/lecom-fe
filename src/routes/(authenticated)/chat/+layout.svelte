<script lang="ts">
	import { page } from '$app/state';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import ConversationList from '$lib/components/layout/ConversationList.svelte';
	import ConversationListSkeleton from '$lib/components/ui/skeleton/ConversationListSkeleton.svelte';

	const { data, children } = $props();
</script>

<div class="mt-2 grid h-[calc(100vh-180px)] grid-cols-12 gap-2 max-md:h-[calc(100vh-100px)]">
	<AnimatedDiv class="col-span-4 h-full overflow-auto rounded-box border bg-base-100 p-4">
		{#await data.allConversationsPromise}
			<ConversationListSkeleton />
		{:then allConversations}
			<ConversationList conversations={allConversations} />
		{:catch error}
			<div
				class="col-span-4 flex h-full items-center justify-center rounded-box border bg-base-100 p-4"
			>
				<p class="text-error">Lỗi tải danh sách cuộc trò chuyện: {error.message}</p>
			</div>
		{/await}
	</AnimatedDiv>

	<AnimatedDiv
		class="col-span-8 h-full overflow-auto rounded-box border bg-base-100 p-4"
		animateVars={{
			delay: 0,
			ease: 'power4.inOut',
			translateY: 16,
			opacity: 0,
			duration: 0.5
		}}
		watch={page.url.pathname}
	>
		{@render children()}
	</AnimatedDiv>
</div>
