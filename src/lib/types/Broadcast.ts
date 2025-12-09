import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const broadcastTypeOptions = [
	{
		title: 'Toàn hệ thống',
		value: 'system'
	}
] as const satisfies readonly FormSelectOption[];

export type BroadcastType = (typeof broadcastTypeOptions)[number]['value'];
