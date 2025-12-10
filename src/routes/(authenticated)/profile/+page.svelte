<script lang="ts">
	import { resolve } from '$app/paths';
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
	import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
	import type { UserProfile } from '$lib/types/UserProfile';
	import { formatDate } from '$lib/utils/converters';
	import { getContext } from 'svelte';

	const { data } = $props();

	const user = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);
	const userProfile = $derived(user());
</script>

<AnimatedDiv class="my-2 flex flex-col gap-1" animateVars={{ translateX: -20 }}>
	<h1 class="text-header3 mt-4 font-bold">Hồ sơ của tôi</h1>
	<p class="text-base-content/60">
		Xem thông tin, theo dõi tiến trình, thành tựu và thống kê học tập của bạn.
	</p>
</AnimatedDiv>

<AnimatedDiv
	animateVars={{ translateY: 20 }}
	class="mt-2 flex grid-cols-10 items-center justify-between gap-6 rounded-box border bg-base-100 p-4 max-md:flex-col"
>
	<UserAvatar
		avatar_url={userProfile.imageUrl}
		letter={userProfile.userName.charAt(0).toUpperCase()}
		sizeClass="w-full aspect-square max-w-24"
	/>

	<div class="col-span-3 flex flex-col gap-2 max-md:w-full">
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Họ và tên</p>
			<p class="font-semibold">{userProfile.fullName ?? 'Không rõ'}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Email</p>
			<p class="font-semibold">{userProfile.email ?? 'Chưa cung cấp email'}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Số điện thoại</p>
			<p class="font-semibold">{userProfile.phoneNumber ?? 'Không rõ'}</p>
		</div>
	</div>

	<div class="col-span-3 flex flex-col gap-2 max-md:w-full">
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Tên đăng nhập</p>
			<p class="font-semibold">{userProfile.userName}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Ngày sinh</p>
			<p class="font-semibold">{formatDate(userProfile.dateOfBirth)}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Địa chỉ</p>
			<p class="font-semibold">{userProfile.address ?? 'Không rõ'}</p>
		</div>
	</div>

	<div class="col-span-2 shrink-0 self-start max-md:w-full">
		<a href="/profile/edit" class="btn float-right btn-soft"
			><span class="icon-[fa7-solid--user-edit] text-xl"></span> Chỉnh sửa hồ sơ
		</a>
	</div>
</AnimatedDiv>

<!-- ================================================================== -->

<AnimatedDiv
	animateVars={{ translateY: 20, delay: 0.1 }}
	class="mt-2 flex flex-col gap-2 rounded-box border bg-base-100 p-4"
>
	<h3>Tổng quan hồ sơ</h3>
	{#await data.gamificationProfilePromise}
		<div class="grid grid-cols-3 gap-4">
			<div class="flex animate-pulse flex-col gap-2 rounded-box border bg-base-200 p-4"></div>
			<div class="flex animate-pulse flex-col gap-2 rounded-box border bg-base-200 p-4"></div>
			<div class="flex animate-pulse flex-col gap-2 rounded-box border bg-base-200 p-4"></div>
		</div>
	{:then gamificationProfile}
		{#if gamificationProfile}
			<div class="grid grid-cols-3 gap-2 max-md:grid-cols-1">
				<!-- XP and Level -->
				<div class="flex flex-col gap-1 rounded-field border bg-base-200 p-4">
					<div class="mb-2 flex items-center gap-2">
						<span class="icon-[fa7-solid--clover] text-xl text-success-content"></span>
						<span class="font-semibold">Cấp độ học tập</span>
					</div>
					<div class="flex justify-between">
						<p class="font-serif text-lg font-bold text-success-content">
							Cấp {gamificationProfile.level}
						</p>
						<p class="font-serif text-lg font-bold text-success-content">
							{gamificationProfile.currentXP} / {gamificationProfile.xpToNextLevel} XP
						</p>
					</div>
					<progress
						class="progress h-4 w-full progress-success"
						value={Math.round(
							(gamificationProfile.currentXP / gamificationProfile.xpToNextLevel) * 100
						)}
						max="100"
					></progress>
					<span class="mt-1 text-xs text-base-content/70">
						{Math.round((gamificationProfile.currentXP / gamificationProfile.xpToNextLevel) * 100)}%
						đến cấp độ tiếp theo
					</span>
					<a href="/profile/quests" class="btn mt-2 btn-block btn-success"
						><span class="icon-[fa7-solid--scroll]"></span>Xem danh sách nhiệm vụ</a
					>
				</div>
				<!-- Coins -->
				<div class="flex flex-col gap-2 rounded-field border bg-base-200 p-4">
					<div class="mb-1 flex items-center gap-2">
						<span class="icon-[fa7-solid--coins] text-xl text-yellow-500"></span>
						<span class="font-semibold">Xu của bạn</span>
					</div>
					<div class="flex grow items-center gap-2">
						<span class="font-serif text-3xl font-bold text-yellow-500"
							>{gamificationProfile.coins} xu</span
						>
					</div>
					<a href={resolve('/profile/rewards-store')} class="btn mt-2 btn-block btn-warning"
						><span class="icon-[fa7-solid--store]"></span>Đến cửa hàng phần thưởng</a
					>
				</div>
				<!-- Current Rank -->
				<div class="flex flex-col gap-2 rounded-field border bg-base-200 p-4">
					<div class="mb-1 flex items-center gap-2">
						<span class="icon-[fa7-solid--trophy] text-xl text-info-content"></span>
						<span class="font-semibold">Xếp hạng học tập</span>
					</div>
					<div class="flex grow items-center gap-2">
						<span class="grow font-serif text-3xl font-bold text-info-content">#?? Tuần này</span>
					</div>
					<a href={resolve('/profile/leaderboards')} class="btn mt-2 btn-block btn-info"
						><span class="icon-[fa7-solid--ranking-star]"></span>Xem bảng xếp hạng</a
					>
				</div>

				<!-- STREAK -->
				{#if gamificationProfile.dailyStreak > 0}
					<div
						class="col-span-3 flex flex-col items-center gap-1 rounded-field border bg-warning p-2 max-md:col-span-1"
					>
						<p class="flex items-center gap-2 text-warning-content">
							<span class="icon-[mingcute--fire-fill] text-xl"></span>Bạn đang trong chuỗi
							<strong>{gamificationProfile.dailyStreak}</strong> ngày học liên tiếp.
						</p>
					</div>
				{:else}
					<div
						class="col-span-3 flex flex-col items-center gap-1 rounded-field border bg-base-200 p-2 max-md:col-span-1"
					>
						<p class="flex items-center gap-2 text-base-content/70">
							<span class="icon-[mingcute--fire-fill] text-xl"></span>Bạn không có chuỗi ngày học
							liên tiếp. Tham gia học hàng ngày để nhận nhiều điểm XP hơn.
						</p>
					</div>
				{/if}
			</div>
		{:else}
			<EmptyPlaceholder text="Không thể tải tổng quan hồ sơ." />
		{/if}
	{:catch error}
		<EmptyPlaceholder text="Không thể tải tổng quan hồ sơ. Có lỗi xảy ra." />
	{/await}
</AnimatedDiv>

<!-- ================================================================== -->

<AnimatedDiv
	animateVars={{ translateY: 20, delay: 0.2 }}
	class="mt-2 flex flex-col gap-2 rounded-box border bg-base-100 p-4"
>
	<div class="flex items-center justify-between">
		<h3>Thành tựu gần đây</h3>
		<a href={resolve('/profile/achievements')} class="btn btn-primary"
			><span class="icon-[fa7-solid--medal]"></span>Xem tất cả thành tựu
		</a>
	</div>
	<EmptyPlaceholder text="Không có gì để hiển thị" />
</AnimatedDiv>
