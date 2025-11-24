<script lang="ts">
	import { invalidate } from '$app/navigation';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
	import { getUserProfile } from '$lib/context/appContext';
	import { chatSchema, type ChatSchema } from '$lib/schemas/chatSchema.js';
	import { formatChatTime } from '$lib/utils/converters.js';
	import type { ToastData } from '$lib/utils/showToast.js';
	import showToast from '$lib/utils/showToast.js';
	import { SignalRChatHub } from '$lib/utils/signalRChatHub.js';
	import { tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { dataForm, dataConversation, dataMessages, token, isSellerChat = false } = $props();

	const conversation = $derived(dataConversation);
	let messages = $state(dataMessages);
	const userProfile = getUserProfile();
	let chatContainer: HTMLDivElement | null = $state(null);
	let messageInput: HTMLInputElement | null = $state(null);

	const { form, errors, message, enhance, submitting, delayed } = superForm<
		ChatSchema,
		{
			toastData: ToastData;
		}
	>(dataForm, {
		invalidateAll: false,
		validators: zod4Client(chatSchema)
	});

	$effect(() => {
		if ($message?.toastData) {
			if ($message.toastData.type !== 'success') {
				showToast($message.toastData);
			}
			// Refocus input after sending message
			setTimeout(() => messageInput?.focus(), 100);
		}
	});

	$effect(() => {
		if (dataMessages) {
			messages = [...dataMessages]; // reset when data.messages changes
		}
		messageInput?.focus();
	});

	$effect(() => {
		if (!token || !conversation.id || !chatContainer) return;

		chatContainer.scrollTo({ top: chatContainer.scrollHeight });

		const chatHub = new SignalRChatHub(conversation.id, token);

		chatHub.connect().then(() => {
			chatHub.onReceiveMessage(async (msg) => {
				messages.push(msg);
				console.log('NEW MESSAGE RECEIVED', msg);

				await tick();

				// Scroll to bottom whenever messages change
				if (chatContainer) {
					chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
				}
			});
		});

		return () => {
			chatHub.disconnect();
		};
	});
</script>

{#if conversation}
	<div class="flex h-full flex-col">
		<!-- Chat header -->
		<div class="flex items-center gap-2 rounded-t-field bg-base-100">
			<Image
				src={conversation?.displayAvatar}
				alt={conversation?.displayName}
				class="h-12 w-12 rounded-full"
				border="{conversation.isAIChat ? 'border-primary' : 'border-secondary'} border-2"
			/>
			<div class="flex grow">
				<div class="flex flex-col justify-between gap-1">
					<p
						class="line-clamp-1 flex items-center gap-1 font-black {conversation.isAIChat
							? 'text-warning-content'
							: 'text-secondary-content'}"
					>
						{#if isSellerChat}
							<span class="icon-[mingcute--user-3-fill] text-2xl"></span>
						{:else}
							<span
								class="text-2xl {conversation?.isAIChat
									? 'icon-[mingcute--ai-line]'
									: 'icon-[mingcute--shop-line]'}"
							></span>
						{/if}
						{conversation?.displayName}
					</p>
					<p class="text-xs text-base-content/70 italic">
						{formatChatTime(conversation?.lastMessageAt)}
					</p>
				</div>
			</div>
			<div class="flex max-w-64 gap-2 rounded-field bg-primary/20 p-2">
				<Image
					src={conversation?.product.thumbnail}
					alt={conversation?.product.name}
					class="h-10 w-10 shrink-0 rounded-field"
				/>

				<div class="flex flex-col justify-between gap-1">
					<p class="flex items-center gap-1 text-sm text-warning-content">
						<span class="icon-[mingcute--box-2-fill]"></span>
						<span class="line-clamp-1">{conversation?.product.name}</span>
					</p>
					<p class="line-clamp-1 text-xs text-base-content/70 italic">
						ID: {conversation?.product.id}
					</p>
				</div>
			</div>
		</div>

		<!-- Chat messages area -->
		<div
			class="mt-2 flex-1 overflow-y-auto rounded-field border bg-secondary/10 p-4"
			bind:this={chatContainer}
		>
			{#each messages as msg (msg.id)}
				<div class="chat {msg.senderId === userProfile?.id ? 'chat-end' : 'chat-start'}">
					<UserAvatar
						avatar_url={msg.senderAvatar}
						letter={msg.senderName?.charAt(0)}
						sizeClass="w-10 h-10 chat-image rounded-full"
					/>
					<div class="chat-header items-center">
						<span class="text-sm font-bold">{msg.senderName}</span>
						<time class="text-xs opacity-50">{formatChatTime(msg.createdAt)}</time>
					</div>
					<div class="chat-bubble {msg.senderId === userProfile?.id ? 'chat-bubble-info' : ''}">
						{msg.content}
					</div>
					<div class="chat-footer mt-1 opacity-50">
						{msg.isRead ? 'Đã xem' : 'Đã gửi'}
					</div>
				</div>
			{/each}
		</div>

		<!-- Chat input area -->
		<div class="mt-2 bg-base-100">
			<form class="flex gap-2" use:enhance method="POST" action="?/sendMessage">
				<input type="hidden" name="toAI" value={conversation?.isAIChat ? true : false} />
				<input
					type="text"
					placeholder="Nhập tin nhắn..."
					class="input w-full input-info"
					name="content"
					bind:this={messageInput}
					bind:value={$form['content']}
					disabled={$submitting}
				/>
				<button type="submit" class="btn btn-info" disabled={$submitting}
					><span class="icon-[fa7-solid--paper-plane]"></span>{$submitting
						? 'Đang gửi...'
						: 'Gửi'}{#if $delayed}<span class="loading loading-infinity"></span>{/if}</button
				>
			</form>
		</div>
	</div>
{:else}
	<EmptyPlaceholder
		icon="icon-[mingcute--arrow-left-circle-line]"
		text="Chọn một cuộc trò chuyện để xem tin nhắn"
	/>
{/if}
