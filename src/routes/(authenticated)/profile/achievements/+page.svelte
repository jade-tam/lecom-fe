<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RedeemRewardSchema } from '$lib/schemas/redeemRewardSchema';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import SmallProfileSummary from '../(components)/SmallProfileSummary.svelte';
	import RewardStoreItem from './(components)/Achievement.svelte';
	import Achievement from './(components)/Achievement.svelte';

	const { data } = $props();
	const achievementsData = $derived(data.achievementsData);

	// Map achievements into categories
	const achievementCategories = $derived(() => {
		const categories: Record<string, Achievement[]> = {};
		for (const achv of achievements) {
			if (!categories[achv.category]) categories[achv.category] = [];
			categories[achv.category].push(achv);
		}
		return categories;
	});

	const completedAchievementsCount = $derived(
		achievementsData.achievements.filter((a) => a.isCompleted).length
	);

	const { form, errors, message, enhance, submitting, delayed } = superForm<
		RedeemRewardSchema,
		{ toastData: ToastData }
	>(data.form);

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
		}
	});
</script>

<!-- Profile summary card -->
<div class="flex items-end justify-between max-md:grid max-md:grid-cols-1">
	<div>
		<a href={resolve('/profile')} class="btn mt-2 btn-sm" aria-label="Quay lại">
			<span class="icon-[fa7-solid--arrow-left]"></span> Trở về trang cá nhân
		</a>
		<h1 class="text-header3 mt-2 font-bold">Thành tựu của bạn</h1>
		<p class="text-base-content/60">
			Khám phá và nhận thưởng cho các thành tựu học tập, mua sắm và hoạt động xã hội của bạn.
		</p>
	</div>
	<!-- Add this summary card below the page description, above the tabs -->
	<div class="mt-2 flex h-fit max-w-xs flex-col gap-1 rounded-box border bg-base-100 p-3">
		<div class="flex items-center gap-2 text-sm">
			<span class="icon-[fa7-solid--trophy] text-warning"></span>
			<span class=""
				><strong>{completedAchievementsCount} / {achievementsData.achievements.length}</strong> Thành
				tựu đã đạt được</span
			>
		</div>
		<progress
			class="progress w-full progress-warning"
			value={completedAchievementsCount}
			max={achievementsData.achievements.length}
		></progress>
	</div>
</div>

<form action="?/claimReward" method="POST" use:enhance>
	<div class="tabs-lift mt-2 tabs">
		{#each achievementsData.categories as category, index (category.value)}
			<label class="tab font-bold text-primary-content hover:text-primary-content">
				<input type="radio" name="storeTabRadio" checked={index === 0} />
				<span class="mr-2 icon-[fa7-solid--medal]"></span>
				{category.title}
			</label>
			<div class="tab-content border-base-300 bg-base-100 p-4">
				{#if achievementsData.achievements.filter((item) => item.category === category.value).length}
					<div class="grid grid-cols-5 gap-2 max-md:grid-cols-3 max-sm:grid-cols-1">
						{#each achievementsData.achievements.filter((item) => item.category === category.value) as achievement}
							<Achievement {achievement} />
						{/each}
					</div>
				{:else}
					<p class="text-base-content/60 italic">Chưa có thành tích nào trong mục này.</p>
				{/if}
			</div>
		{/each}
	</div>
</form>
