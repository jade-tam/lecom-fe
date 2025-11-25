<script lang="ts">
	import { resolve } from '$app/paths';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import { type QuestClaimSchema } from '$lib/schemas/questClaimSchema';
	import type { ToastData } from '$lib/utils/showToast';
	import showToast from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import SmallProfileSummary from '../(components)/SmallProfileSummary.svelte';
	import QuestGroup from './(components)/QuestGroup.svelte';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';

	const { data } = $props();

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
			<AnimatedDiv animateVars={{ translateX: -20 }}>
				<a href={resolve('/profile')} class="btn mt-2 btn-sm" aria-label="Quay lại">
					<span class="icon-[fa7-solid--arrow-left]"></span> Trở về trang cá nhân
				</a>
				<h1 class="text-header3 mt-2 font-bold">Nhiệm vụ của bạn</h1>
				<p class="text-base-content/60">
					Hoàn thành nhiệm vụ mỗi ngày để nhận XP và xu, tăng cấp độ trên hành trình học tập của
					bạn.
				</p>
			</AnimatedDiv>
			<SmallProfileSummary {gamificationProfile} />
		</div>

		<!-- Daily Quests Section -->
		<form method="POST" use:enhance action="?/claimReward">
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
