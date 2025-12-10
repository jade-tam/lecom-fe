<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RedeemRewardSchema } from '$lib/schemas/redeemRewardSchema';
	import { achievementCategoryOptions, type Achievement } from '$lib/types/Gamification.js';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import AchievementCard from './(components)/AchievementCard.svelte';
	import { getTitleFromOptionList } from '$lib/utils/converters';

	const { data } = $props();
	let achievements: Achievement[] = $state([]);
	let isLoading: boolean = $state(true);

	// Map achievements into categories
	const achievementCategories = $derived(() => {
		const categories: Record<string, Achievement[]> = {};
		for (const achv of achievements) {
			if (!categories[achv.category]) categories[achv.category] = [];
			categories[achv.category].push(achv);
		}
		return categories;
	});

	const completedAchievementsCount = $derived(achievements.filter((a) => a.isCompleted).length);

	const { form, errors, message, enhance, submitting, delayed } = superForm<
		RedeemRewardSchema,
		{ toastData: ToastData }
	>(data.form);

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
		}
	});

	$effect(() => {
		const setAchievements = async () => {
			const resolvedData = await data.achievementsDataPromise;
			achievements = resolvedData?.achievements || [];
			isLoading = false;
		};

		setAchievements();
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
				><strong>{completedAchievementsCount} / {achievements.length}</strong> Thành
				tựu đã đạt được</span
			>
		</div>
		<progress
			class="progress w-full progress-warning"
			value={completedAchievementsCount}
			max={achievements.length}
		></progress>
	</div>
</div>

<form action="?/claimReward" method="POST" use:enhance>
	<div class="tabs-lift mt-2 tabs">
		{#each Object.entries(achievementCategories()) as [categoryKey, categoryAchievements], index (categoryKey)}
			<label class="tab font-bold text-primary-content hover:text-primary-content">
				<input type="radio" name="achievementTabRadio" checked={index === 0} />
				<span class="mr-2 icon-[fa7-solid--medal]"></span>
				{getTitleFromOptionList(categoryKey, achievementCategoryOptions)}
			</label>
			<div class="tab-content border-base-300 bg-base-100 p-4">
				{#if categoryAchievements.length}
					<div class="grid grid-cols-5 gap-2 max-md:grid-cols-3 max-sm:grid-cols-1">
						{#each categoryAchievements as achievement (achievement.id)}
							<AchievementCard {achievement} />
						{/each}
					</div>
				{:else}
					<p class="text-base-content/60 italic">Chưa có thành tích nào trong mục này.</p>
				{/if}
			</div>
		{/each}
	</div>
</form>
