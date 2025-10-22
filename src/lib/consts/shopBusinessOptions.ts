import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const shopBusinessOptions = [
	{
		title: 'Personal',
		value: 'personal'
	},
	{
		title: 'Business',
		value: 'business'
	}
] as const satisfies readonly FormSelectOption[];
