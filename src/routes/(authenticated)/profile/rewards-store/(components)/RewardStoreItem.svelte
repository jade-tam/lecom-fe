<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import type { RewardStoreItemType } from '$lib/types/Gamification';

	const {
		item,
		itemIndex
	}: {
		item: RewardStoreItemType;
		itemIndex: number;
	} = $props();

	const gadgetIconMap = ['icon-[mingcute--flash-fill]', 'icon-[mingcute--truck-fill]'];
</script>

<AnimatedDiv
	animateVars={{
		translateY: 24,
		delay: itemIndex * 0.1,
		duration: 0.5
	}}
	class="flex flex-col justify-between gap-2 rounded-field border-2 {item.type === 'Booster'
		? 'border-info-content/30 bg-info text-info-content'
		: 'border-success-content/30 bg-success text-success-content'} p-2"
>
	<div class="mx-auto flex py-4">
		{#if item.imageUrl}<Image class="h-24 w-24" src={item.imageUrl} alt={item.title} border="" />
		{:else if item.type === 'Booster' && itemIndex !== undefined}
			<span class="{gadgetIconMap[itemIndex]} text-7xl"></span>
		{:else}
			<span class="icon-[mingcute--ticket-fill] text-7xl"></span>
		{/if}
	</div>
	<div>
		<p class="font-bold">
			{item.title}
		</p>
		<p class="text-sm text-base-content/60">{item.description}</p>
	</div>
	<div class="flex items-center justify-between">
		<p class="text-xs text-secondary-content italic">
			{item.durationDescription}
		</p>
	</div>
	<button
		type="submit"
		name="rewardCode"
		value={item.rewardCode}
		class="btn mt-1 w-full btn-primary"
		disabled={!item.redeemable}
		>Đổi thưởng - {item.coinCost} xu <span class="icon-[fa7-solid--coins]"></span></button
	>
</AnimatedDiv>
