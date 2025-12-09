import type { FormSelectOption } from '$lib/components/ui/FormSelect.svelte';

export const shopBusinessOptions = [
	{
		title: 'Cá nhân',
		value: 'personal'
	},
	{
		title: 'Doanh nghiệp',
		value: 'business'
	}
] as const satisfies readonly FormSelectOption[];
