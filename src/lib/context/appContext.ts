import { NOTIFICATIONS_CONTEXT, TOKEN_CONTEXT, USER_PROFILE_CONTEXT } from '$lib/consts/contexts';
import type { Notification } from '$lib/types/Notification';
import type { UserProfile } from '$lib/types/UserProfile';
import { getContext } from 'svelte';

export const getUserProfile = () => {
	return getContext<() => UserProfile>(USER_PROFILE_CONTEXT)();
};

export const getNotificationsPromise = () => {
	return getContext<() => Promise<Notification[]>>(NOTIFICATIONS_CONTEXT)();
};

export const getToken = () => {
	return getContext<() => string | null>(TOKEN_CONTEXT)();
};
