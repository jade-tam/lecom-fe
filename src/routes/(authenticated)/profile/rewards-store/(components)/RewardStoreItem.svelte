<script lang="ts">
	import Image from '$lib/components/ui/Image.svelte';
	import type { RewardStoreItem } from '$lib/types/Gamification';

	const {
		item
	}: {
		item: RewardStoreItem;
	} = $props();
</script>

<div
	class="flex flex-col justify-between gap-2 rounded-field border-2 {item.type === 'booster'
		? 'border-info/30 bg-info/20'
		: 'border-success/30 bg-success/20'} p-2"
>
	<div class="mx-auto flex py-4">
		<Image class="h-24 w-24" src={item.imageUrl} alt={item.title} border="" />
	</div>
	<div>
		<p class="font-bold {item.type === 'booster' ? 'text-info-content' : 'text-success-content'}">
			{item.title}
		</p>
		<p class="text-sm text-base-content/60">{item.description}</p>
	</div>
	<div class="flex items-center justify-between">
		<p class="text-xs text-secondary-content/60 italic">
			{item.durationDescription}
		</p>
		<p class="flex items-center gap-2 font-serif text-xl font-bold text-yellow-500">
			{item.coinCost} xu <span class="icon-[fa7-solid--coins]"></span>
		</p>
	</div>
	<button
		type="submit"
		name="rewardCode"
		value={item.id}
		class="btn w-full btn-primary"
		disabled={!item.redeemable}>Đổi thưởng</button
	>
</div>
