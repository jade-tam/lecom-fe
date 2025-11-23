import { USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
import type { UserProfile } from '$lib/types/UserProfile';
import { getContext } from 'svelte';

export const getUserProfile = () => {
	return getContext<() => UserProfile>(USER_PROFILE_CONTEXT)();
};
