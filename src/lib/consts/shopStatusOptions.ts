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
		title: 'Rejected',
		value: 'Rejected'
	}
] as const satisfies readonly FormSelectOption[];
