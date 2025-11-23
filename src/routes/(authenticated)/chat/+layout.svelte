<script lang="ts">
	import ConversationList from '$lib/components/layout/ConversationList.svelte';

	const { data, children } = $props();
</script>

<div class="mt-2 grid h-[calc(100vh-180px)] grid-cols-12 gap-2 max-md:h-[calc(100vh-100px)]">
	<ConversationList conversations={data.allConversations} />

	<div class="col-span-8 h-full overflow-auto rounded-box border bg-base-100 p-4">
		{@render children()}
	</div>
</div>
