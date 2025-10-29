<script lang="ts">
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
	import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
	import type { UserProfile } from '$lib/types/UserProfile';
	import { formatDate } from '$lib/utils/converters';
	import { getContext } from 'svelte';

	const user = getContext<() => UserProfile>(USER_PROFILE_CONTEXT);
	const userProfile = $derived(user());
</script>

<h1 class="text-header3 mt-4 font-bold">My Profile</h1>
<p class="text-base-content/60">
	Your personal dashboard — track progress, achievements, and stats.
</p>

<div class="mt-2 grid grid-cols-10 items-center gap-6 rounded-box border bg-base-100 p-4">
	<div class="col-span-1 flex justify-center">
		<UserAvatar
			avatar_url={userProfile.imageUrl}
			letter={userProfile.userName.charAt(0).toUpperCase()}
			sizeClass="w-full aspect-square max-w-28"
		/>
	</div>

	<div class="col-span-4 flex flex-col gap-2">
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Full Name</p>
			<p class="font-semibold">{userProfile.fullName}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Email</p>
			<p class="font-semibold">{userProfile.email ?? 'No email provided'}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Phone Number</p>
			<p class="font-semibold">{userProfile.phoneNumber}</p>
		</div>
	</div>

	<div class="col-span-3 flex flex-col gap-2">
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Username</p>
			<p class="font-semibold">{userProfile.userName}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Dete Of Birth</p>
			<p class="font-semibold">{formatDate(userProfile.dateOfBirth)}</p>
		</div>
		<div class="flex flex-col">
			<p class="text-xs text-base-content/60">Address</p>
			<p class="font-semibold">{userProfile.address}</p>
		</div>
	</div>

	<div class="col-span-2 self-start">
		<a href="/profile/edit" class="btn float-right btn-soft"
			><span class="icon-[fa7-solid--user-edit] text-xl"></span> Edit Profile
		</a>
	</div>
</div>

<!-- ================================================================== -->

<div class="mt-2 flex flex-col gap-2 rounded-box border bg-base-100 p-4">
	<h3>Profile stats</h3>
	<p>Updating...</p>
</div>

<!-- ================================================================== -->

<div class="mt-2 flex flex-col gap-2 rounded-box border bg-base-100 p-4">
	<h3>Recent Achievements</h3>
	<p>Updating...</p>
</div>
