import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const shopStatusOptions = [
	{
		title: 'Approved',
		value: 'Approved'
	},
	{
		title: 'Pending',
		value: 'Pending'
	},
	{
		title: 'Reject',
		value: 'Reject'
	}
] as const satisfies readonly FormSelectOption[];
