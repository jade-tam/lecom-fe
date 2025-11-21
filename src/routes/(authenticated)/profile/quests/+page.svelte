<script lang="ts">
	import { resolve } from '$app/paths';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
	import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
	import { type QuestClaimSchema } from '$lib/schemas/questClaimSchema';
	import type { UserProfile } from '$lib/types/UserProfile';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { getContext } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import QuestGroup from './(components)/QuestGroup.svelte';
	import SmallProfileSummary from '../(components)/SmallProfileSummary.svelte';

	const { data } = $props();

	const user = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);
	const userProfile = $derived(user());

	const { form, errors, message, enhance, submitting, delayed } = superForm<
		QuestClaimSchema,
		{ toastData: ToastData }
	>(data.form);

	$effect(() => {
		if ($message?.toastData) {
			showToast($message.toastData);
		}
	});
</script>

{#await data.gamificationProfilePromise}
	<!-- Loading skeleton here -->
{:then gamificationProfile}
	{#if gamificationProfile}
		<!-- Profile summary card -->
		<div class="flex justify-between max-md:grid max-md:grid-cols-1">
			<div>
				<a href={resolve('/profile')} class="btn mt-2 btn-sm" aria-label="Quay lại">
					<span class="icon-[fa7-solid--arrow-left]"></span> Trở về trang cá nhân
				</a>
				<h1 class="text-header3 mt-2 font-bold">Nhiệm vụ của bạn</h1>
				<p class="text-base-content/60">
					Hoàn thành nhiệm vụ mỗi ngày để nhận XP và xu, tăng cấp độ trên hành trình học tập của
					bạn.
				</p>
			</div>
			<SmallProfileSummary {gamificationProfile} />
		</div>

		<!-- Daily Quests Section -->
		<form method="POST" use:enhance action="?/claimReward">
			<QuestGroup
				quests={[
					{
						id: 'mock-quest',
						title: 'Hoàn thành 5 bài học mẫu',
						description: 'Thử hoàn thành một bài học để nhận thưởng.',
						currentCount: 2,
						targetCount: 5,
						xpReward: 10,
						coinReward: 15,
						isCompleted: false,
						isRewardClaimed: false,
						deadline: new Date().toISOString()
					},
					{
						id: 'mock-quest2',
						title: 'Hoàn thành 25 chiếc bánh mì',
						description: 'Mở lò bánh mì đi.',
						currentCount: 25,
						targetCount: 25,
						xpReward: 64,
						coinReward: 156,
						isCompleted: true,
						isRewardClaimed: false,
						deadline: new Date().toISOString()
					},
					{
						id: 'mock-quest3',
						title: 'Thu thập 1543 trái cà tím',
						description: 'Thu thập 1543 trái cà tím.',
						currentCount: 1543,
						targetCount: 1543,
						xpReward: 124,
						coinReward: 250,
						isCompleted: true,
						isRewardClaimed: true,
						deadline: new Date().toISOString()
					}
				]}
				title="Nhiệm vụ DEMO"
				icon="icon-[fa7-solid--money-bill-wheat]"
			/>
			<QuestGroup
				quests={gamificationProfile.dailyQuests}
				title="Nhiệm vụ hàng ngày"
				icon="icon-[fa7-solid--sun]"
			/>
			<QuestGroup
				quests={gamificationProfile.weeklyQuests}
				title="Nhiệm vụ tuần"
				icon="icon-[fa7-solid--calendar-week]"
			/>
			<QuestGroup
				quests={gamificationProfile.monthlyQuests}
				title="Nhiệm vụ tháng"
				icon="icon-[fa7-solid--calendar-alt]"
			/>
		</form>
	{:else}
		<EmptyPlaceholder text="Không tìm thấy dữ liệu nhiệm vụ hoặc hồ sơ." />
	{/if}
{:catch error}
	<EmptyPlaceholder text="Không thể tải tổng quan hồ sơ hoặc nhiệm vụ." />
{/await}
