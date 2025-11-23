<script lang="ts">
	import Conversation from '$lib/components/layout/Conversation.svelte';

	const { data } = $props();
</script>

<Conversation
	dataForm={data.form}
	dataConversation={data.conversation}
	dataMessages={data.messages}
	token={data.token}
/>
