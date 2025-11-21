<script lang="ts">
	import { resolve } from '$app/paths';
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
	import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
	import type { GamificationProfile } from '$lib/types/Gamification';
	import type { UserProfile } from '$lib/types/UserProfile';
	import { getContext } from 'svelte';

	const { gamificationProfile }: { gamificationProfile: GamificationProfile } = $props();

	const user = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);
	const userProfile = $derived(user());
</script>

<div class="mt-2 flex shrink-0 items-center gap-4 rounded-box border bg-base-100 p-3">
	<UserAvatar
		avatar_url={userProfile.imageUrl}
		letter={userProfile.userName.charAt(0).toUpperCase()}
		sizeClass="w-14 h-14"
	/>
	<div class="flex w-full flex-col gap-1">
		<div class="flex justify-between">
			<span class="font-semibold">{userProfile.fullName}</span>
			<a href={resolve('/profile/rewards-store')} class="btn btn-xs btn-warning"
				><span class="icon-[fa7-solid--store]"></span>Đến cửa hàng</a
			>
		</div>
		<div class="mt-1 flex items-center">
			<div class="flex flex-col gap-1">
				<div class="flex justify-between">
					<span class="flex items-center gap-1 text-xs text-success-content"
						><span class="icon-[fa7-solid--clover]"></span>Cấp {gamificationProfile.level}</span
					>
					<span class="text-xs text-success-content">
						{gamificationProfile.currentXP}/{gamificationProfile.xpToNextLevel} XP
					</span>
				</div>
				<progress
					class="progress w-32 progress-success"
					value={gamificationProfile.currentXP}
					max={gamificationProfile.xpToNextLevel}
				></progress>
			</div>

			<div class="divider divider-horizontal"></div>

			<div class="flex items-center gap-2 text-yellow-500">
				<span class="icon-[fa7-solid--coins]"></span>
				<span class="mr-2 font-serif text-xl font-bold">{gamificationProfile.coins} xu</span>
			</div>
		</div>
	</div>
</div>
