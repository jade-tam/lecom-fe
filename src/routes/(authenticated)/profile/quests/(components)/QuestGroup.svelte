<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import type { Quest } from '$lib/types/Gamification';
	import QuestCard from './QuestCard.svelte';

	const {
		quests,
		title,
		icon
	}: {
		quests: Quest[];
		title: string;
		icon: string;
	} = $props();

	const nonCompletedQuests = $derived(
		quests.filter((q) => q.status !== 'Completed' && q.status !== 'Claimed')
	);
</script>

<AnimatedDiv animateVars={{ translateY: 20 }} class="mt-2 rounded-box border bg-base-100 p-4">
	<div class="mb-2 flex flex-wrap items-center gap-2">
		<span class="{icon} shrink-0 text-xl text-warning-content"></span>
		<span class="font-serif text-lg font-bold">{title}</span>
		{#if nonCompletedQuests.length > 0}
			<span class="ml-2 badge badge-secondary"
				><strong>{nonCompletedQuests.length}</strong> nhiệm vụ chưa hoàn thành</span
			>
		{:else}
			<span class="ml-2 badge badge-success">Đã hoàn thành tất cả nhiệm vụ</span>
		{/if}
	</div>
	<div class="flex max-h-92 flex-col gap-2 overflow-y-auto">
		{#each quests as quest, index (quest.id)}
			<QuestCard {quest} {index} />
		{/each}
		{#if quests.length === 0}
			<EmptyPlaceholder text="Không tìm thấy nhiệm vụ nào." />
		{/if}
	</div>
</AnimatedDiv>
