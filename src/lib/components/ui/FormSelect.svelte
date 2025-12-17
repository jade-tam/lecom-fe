<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import ToolTip from './ToolTip.svelte';

	export type FormSelectOption = {
		title: string;
		value: boolean | number | string;
	};

	let {
		label,
		options = [],
		icon = '',
		help = '',
		superForm,
		errors,
		name,
		hidden = false,
		class: className = '',
		placeholder = 'Lựa chọn',
		isValueNumber = false,
		...restSelectAttr
	}: HTMLSelectAttributes & {
		label: string;
		options: Readonly<FormSelectOption[]>;
		icon?: string;
		help?: string;
		name: string;
		hidden?: boolean;
		class?: string;
		superForm: SuperFormData<any>;
		isValueNumber?: boolean;
		errors: SuperFormErrors<Record<string, string>>;
	} = $props();
</script>

<fieldset in:fly={{ y: 12, duration: 500 }} class={`fieldset ${className}`} class:hidden>
	<legend class="fieldset-legend"
		>{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>

	<select class="select w-full" {name} bind:value={$superForm[name]} {...restSelectAttr}>
		<option disabled selected value={isValueNumber ? 0 : ''} class="italic">{placeholder}</option>

		{#each options as option}
			<option value={option.value}>{option.title}</option>
		{/each}
	</select>
	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
