<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import type { Quest } from '$lib/types/Gamification';

	const { quest, index }: { quest: Quest; index: number } = $props();
</script>

<AnimatedDiv
	animateVars={{ translateY: 20, delay: 0.1 * index }}
	class="flex flex-col gap-2 rounded-box border bg-base-200 p-4"
>
	<div class="flex items-center justify-between">
		<div>
			<p class="flex items-center gap-2 font-semibold">
				<span class="icon-[fa7-solid--scroll] text-secondary-content"></span>{quest.title}
			</p>
			<p class="mt-1 text-xs text-base-content/70">{quest.description}</p>
		</div>
		<div class="flex flex-col items-end gap-1">
			<span class="flex items-center gap-1 text-sm font-bold text-success-content">
				+{quest.xpReward} XP <span class="icon-[fa7-solid--clover] text-xs"></span>
			</span>
			<span class="flex items-center gap-1 text-sm font-bold text-yellow-500">
				+{quest.coinReward} <span class="icon-[fa7-solid--coins] text-xs"></span>
			</span>
		</div>
	</div>
	<div class="mt-2 flex items-center gap-x-2.5">
		<progress
			class="progress w-84 {quest.isCompleted ? 'progress-success' : 'progress-secondary'}"
			value={quest.currentCount}
			max={quest.targetCount}
		></progress>
		<span class="text-xs text-base-content/70">{quest.currentCount}/{quest.targetCount}</span>
		{#if quest.isCompleted}
			<div class="ml-auto badge shrink-0 badge-success">
				<span class="icon-[fa7-solid--check-circle] text-xs"></span>Hoàn thành
			</div>
			{#if !quest.isRewardClaimed}
				<button type="submit" name="userQuestId" value={quest.id} class="btn btn-sm btn-primary"
					><span class="icon-[fa7-solid--coins] text-xs"></span>Nhận thưởng</button
				>
			{:else}
				<div class="badge shrink-0 badge-success">
					<span class="icon-[fa7-solid--coins] text-xs"></span>Đã nhận thưởng
				</div>
			{/if}
		{:else}
			<div class="ml-auto badge shrink-0 badge-secondary">
				<span class="icon-[fa7-solid--ellipsis] text-xs"></span>Đang thực hiện
			</div>
		{/if}
	</div>
</AnimatedDiv>
