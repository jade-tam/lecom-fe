<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import type { Achievement } from '$lib/types/Gamification';
	import { formatDate } from '$lib/utils/converters';

	const {
		achievement
	}: {
		achievement: Achievement;
	} = $props();
</script>

<div
	class="flex flex-col items-center justify-between gap-2 rounded-field border-2 {achievement.isCompleted
		? 'border-warning/50 bg-warning/30'
		: 'border-base-300 bg-base-200'} p-4"
>
	<div class="mx-auto flex py-2">
		<Image class="h-16 w-16" src={achievement.imageUrl} alt={achievement.title} border="" />
	</div>
	<div>
		<p class="text-center font-bold text-base-content">
			{achievement.title}
		</p>
		<p class="text-center text-sm text-base-content/60">{achievement.description}</p>
	</div>
	<div class="my-2 flex items-end gap-2">
		<span class="flex items-center gap-1 text-sm font-bold text-success-content">
			+{achievement.xpReward} XP <span class="icon-[fa7-solid--clover] text-xs"></span>
		</span>
		<span class="flex items-center gap-1 text-sm font-bold text-yellow-500">
			+{achievement.coinReward} <span class="icon-[fa7-solid--coins] text-xs"></span>
		</span>
	</div>
	{#if achievement.isCompleted}
		<div class="badge badge-success">
			<span class="icon-[fa7-solid--check-circle] text-xs"></span>Đã đạt được
		</div>
		<button
			type="submit"
			name="id"
			value={achievement.id}
			class="btn btn-sm btn-primary"
			disabled={achievement.isRewardClaimed}
		>
			<span class="icon-[fa7-solid--coins] text-xs"></span>{achievement.isRewardClaimed
				? 'Đã nhận thưởng'
				: 'Nhận thưởng'}
		</button>
		{#if achievement.completedAt}
			<p class="text-xs text-base-content/60 italic">
				Hoàn thành ngày {formatDate(achievement.completedAt)}
			</p>
		{/if}
	{:else}
		<div class="flex w-full flex-col items-center gap-2">
			<progress
				class="progress progress-warning"
				value={achievement.currentCount}
				max={achievement.targetCount}
			></progress>
			<span class="text-xs text-base-content/70"
				>Tiến độ {achievement.currentCount} / {achievement.targetCount}</span
			>
		</div>
	{/if}
</div>
