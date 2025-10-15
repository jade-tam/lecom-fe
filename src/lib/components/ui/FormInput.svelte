<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import ToolTip from './ToolTip.svelte';

	let {
		label,
		icon = '',
		help = '',
		superForm,
		errors,
		name,
		hidden = false,
		...restInputAttr
	}: HTMLInputAttributes & {
		label: string;
		icon?: string;
		help?: string;
		name: string;
		hidden?: boolean;
		superForm: SuperFormData<any>;
		errors: SuperFormErrors<Record<string, string>>;
	} = $props();
</script>

<fieldset class="fieldset" class:hidden>
	<legend class="fieldset-legend"
		>{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>
	<label class="input w-full">
		{#if icon}
			<span class={`${icon} text-secondary`}></span>
		{/if}
		<input {name} bind:value={$superForm[name]} {...restInputAttr} />
	</label>
	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
