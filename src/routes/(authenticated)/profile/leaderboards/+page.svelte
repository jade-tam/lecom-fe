<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';
	import {
		leaderboardPeriodOptions,
		type Leaderboard,
		type LeaderboardPeriod
	} from '$lib/types/Gamification.js';

	const { data } = $props();
	let leaderboard: Leaderboard | null = $state(null);
	let isLoading: boolean = $state(true);
	let selectedPeriod: LeaderboardPeriod = $state('weekly');

	$effect(() => {
		const setLeaderboard = async () => {
			const resolvedData = await data.leaderboardPromise;
			leaderboard = resolvedData;
			isLoading = false;
		};

		setLeaderboard();
	});

	function getRankBadgeColor(rank: number): string {
		if (rank === 1) return 'from-yellow-400 to-yellow-600 badge-xl';
		if (rank === 2) return 'from-gray-200 to-gray-400 badge-lg';
		if (rank === 3) return 'from-amber-500 to-amber-800 badge-md';
		return 'bg-base-300 text-base-content/70';
	}

	function getRankIcon(rank: number): string {
		if (rank === 1) return 'icon-[mingcute--vip-2-fill] text-yellow-300';
		if (rank === 2) return 'icon-[mingcute--hexagon-fill] text-zinc-200';
		if (rank === 3) return 'icon-[mingcute--triangle-fill] text-amber-500';
		return '';
	}

	function isCurrentUser(userId: string): boolean {
		return leaderboard?.currentUser.userId === userId;
	}
</script>

<div class="my-2 flex flex-wrap items-end justify-between">
	<AnimatedDiv animateVars={{ translateX: -16 }} class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<button class="btn btn-sm" aria-label="Quay lại" onclick={() => history.back()}>
				<span class="icon-[fa7-solid--arrow-left]"></span> Trở về
			</button>
			<h1 class="text-header3 font-bold">Bảng xếp hạng</h1>
		</div>
		<p class="text-base-content/60">Xem vị trí của bạn trên bảng xếp hạng học tập.</p>
	</AnimatedDiv>

	<AnimatedDiv animateVars={{ translateX: 16 }} class="flex gap-2">
		{#each leaderboardPeriodOptions as option}
			<button
				onclick={() => (selectedPeriod = option.value)}
				class={`btn transition-all btn-sm ${selectedPeriod === option.value ? 'btn-primary' : ''}`}
				disabled={option.value === 'daily' || option.value === 'monthly'}
			>
				{option.title}
			</button>
		{/each}
	</AnimatedDiv>
</div>

{#if isLoading}
	<LoadingPlaceholder text="Đang tải bảng xếp hạng..." />
{:else if leaderboard}
	<!-- Current User Card -->
	<div
		class="mt-3 mb-3 overflow-hidden rounded-box bg-gradient-to-r from-primary/50 to-secondary/50 p-1"
	>
		<div class="flex items-center justify-between gap-4 rounded-box bg-base-100 p-4">
			<div class="flex items-center gap-4">
				<div
					class={`badge bg-gradient-to-br badge-lg ${getRankBadgeColor(leaderboard.currentUser.rank)}`}
				>
					#{leaderboard.currentUser.rank}
				</div>
				<div class="flex items-center gap-3">
					<Image
						src={leaderboard.currentUser.avatarUrl}
						alt={leaderboard.currentUser.displayName}
						class="h-12 w-12 rounded-full border-2 border-primary object-cover"
					/>
					<div>
						<p class="font-bold">{leaderboard.currentUser.displayName}</p>
						<p class="text-sm text-base-content/60">Cấp độ {leaderboard.currentUser.level}</p>
					</div>
				</div>
			</div>
			<div class="text-right">
				<p class="font-serif text-3xl font-bold text-success-content">
					{leaderboard.currentUser.score} XP
				</p>
				<p class="text-xs text-success-content/60">điểm XP tích luỹ kỳ này</p>
			</div>
		</div>
	</div>

	<!-- Stats Section -->
	<div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
		<div class="rounded-box border bg-base-100 p-4">
			<div class="flex items-center gap-3">
				<span class="icon-[mingcute--chart-bar-fill] text-2xl text-secondary-content"></span>
				<div>
					<p class="text-sm text-base-content/60">Vị trí hiện tại của bạn</p>
					<p class="text-lg font-bold">
						#{leaderboard.currentUser.rank}
					</p>
				</div>
			</div>
		</div>

		<div class="rounded-box border bg-base-100 p-4">
			<div class="flex items-center gap-3">
				<span class="icon-[mingcute--sunflower-fill] text-2xl text-success-content"></span>
				<div>
					<p class="text-sm text-base-content/60">Điểm kinh nghiệm tích luỹ của bạn</p>
					<p class="font-serif text-lg font-bold text-success-content">
						{leaderboard.currentUser.score} XP
					</p>
				</div>
			</div>
		</div>

		<div class="rounded-box border bg-base-100 p-4">
			<div class="flex items-center gap-3">
				<span class="icon-[mingcute--vip-2-fill] text-2xl text-warning"></span>
				<div>
					<p class="text-sm text-base-content/60">Hạng nhất</p>
					<p class="text-lg font-bold text-warning-content">
						{leaderboard.entries[0]?.displayName ?? 'N/A'}
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Leaderboard List -->
	<div class="overflow-hidden rounded-box border bg-base-100">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th class="w-16 text-center">Xếp hạng</th>
						<th>Tên người học</th>
						<th class="w-20 text-center">Cấp độ hiện tại</th>
						<th class="w-24 text-right">XP tích luỹ</th>
					</tr>
				</thead>
				<tbody>
					{#each leaderboard.entries as entry (entry.userId)}
						<tr
							class={`transition-all ${
								isCurrentUser(entry.userId) ? 'bg-primary/20 font-bold' : ''
							}`}
						>
							<td class="text-center">
								<div class="flex items-center justify-center gap-2">
									{#if entry.rank <= 3}
										<div
											class={`badge bg-gradient-to-br ${getRankBadgeColor(entry.rank)} p-2`}
										>
											<span class={getRankIcon(entry.rank)}></span>
										</div>
									{:else}
										<div class="badge bg-base-300 p-2">
											<span class="font-bold">#{entry.rank}</span>
										</div>
									{/if}
								</div>
							</td>
							<td>
								<div class="flex items-center gap-3">
									<Image
										src={entry.avatarUrl}
										alt={entry.displayName}
										class="h-10 w-10 rounded-full object-cover"
									/>
									<div>
										<p class="font-semibold">{entry.displayName}</p>
										{#if isCurrentUser(entry.userId)}
											<p class="text-xs font-semibold text-primary-content">Bạn</p>
										{/if}
									</div>
								</div>
							</td>
							<td class="text-center">
								<div class="flex items-center justify-center gap-2">
									<span class="font-bold font-serif text-lg text-success-content">Cấp {entry.level}</span>
								</div>
							</td>
							<td class="text-right">
								<span class="text-lg font-bold text-success-content font-serif">{entry.score} XP</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else}
	<EmptyPlaceholder text="Không có dữ liệu bảng xếp hạng để hiển thị." />
{/if}
