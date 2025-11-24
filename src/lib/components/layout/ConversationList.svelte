<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Conversation } from '$lib/types/Chat';
	import { formatChatTime } from '$lib/utils/converters';
	import EmptyPlaceholder from '../ui/EmptyPlaceholder.svelte';
	import Image from '../ui/Image.svelte';

	const {
		conversations,
		isSellerChat = false
	}: { conversations: Conversation[]; isSellerChat?: boolean } = $props();

	const allConversations: Conversation[] = $derived(
		conversations.sort(
			(a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
		)
	);

	const currentConversationId = $derived(page.params.conversationId);
</script>

<h1 class="text-header3 mb-2 flex items-center gap-2 text-info-content">
	<span class="icon-[mingcute--message-4-fill]"></span>Trò chuyện và tin nhắn
</h1>

{#if allConversations.length}
	<div class="flex flex-col gap-2">
		{#each allConversations as conversation (conversation.id)}
			<a
				href={resolve(
					isSellerChat
						? '/(seller)/seller/chat/[conversationId]'
						: '/(authenticated)/chat/[conversationId]',
					{
						conversationId: conversation.id
					}
				)}
				class="flex justify-start gap-2 rounded-field border-2 bg-base-200 p-2 duration-200 {currentConversationId ===
				conversation.id
					? 'border-info-content/50 bg-info/50'
					: 'border-base-200 hover:bg-info/30'} cursor-pointer"
			>
				<Image
					src={conversation.displayAvatar}
					alt={conversation.displayName}
					class="h-16 w-16 shrink-0 rounded-full object-cover"
					border="{conversation.isAIChat ? 'border-primary' : 'border-secondary'} border-2"
				/>
				<div class="flex grow flex-col gap-1">
					<div class="flex justify-between">
						<p
							class="line-clamp-1 flex items-center gap-1 text-xs font-black {conversation.isAIChat
								? 'text-warning-content'
								: 'text-secondary-content'}"
						>
							{#if isSellerChat}
								<span class="icon-[mingcute--user-3-fill] text-xl"></span>
							{:else}
								<span
									class="shrink-0 text-xl {conversation.isAIChat
										? 'icon-[mingcute--ai-line]'
										: 'icon-[mingcute--shop-line]'}"
								></span>
							{/if}
							{conversation.displayName ? conversation.displayName : 'No display name'}
						</p>
						<p class="shrink-0 text-right text-xs text-base-content/70 italic">
							{formatChatTime(conversation.lastMessageAt)}
						</p>
					</div>

					<p class="line-clamp-1 text-sm text-base-content">
						{conversation.product.name}
					</p>

					<p class="line-clamp-1 text-xs text-base-content/70">
						{conversation.lastMessage ? conversation.lastMessage : 'Cuộc trò chuyện mới'}
					</p>
				</div>
				<div class="flex flex-col items-end justify-between"></div>
			</a>
		{/each}
	</div>
{:else}
	<EmptyPlaceholder text="Không có cuộc trò chuyện nào" />
{/if}
