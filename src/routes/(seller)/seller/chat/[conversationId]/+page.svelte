<script lang="ts">
	import Conversation from '$lib/components/layout/Conversation.svelte';
	import ConversationSkeleton from '$lib/components/ui/skeleton/ConversationSkeleton.svelte';

	const { data } = $props();
</script>

{#await Promise.all([data.conversationPromise, data.messagesPromise])}
	<ConversationSkeleton />
{:then [conversation, messages]}
	<Conversation
		dataForm={data.form}
		dataConversation={conversation}
		dataMessages={messages}
		token={data.token}
		isSellerChat
	/>
{/await}
