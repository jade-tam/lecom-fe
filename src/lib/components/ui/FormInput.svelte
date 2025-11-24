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
		postfix,
		hidden = false,
		class: className = '',
		...restInputAttr
	}: HTMLInputAttributes & {
		label: string;
		icon?: string;
		help?: string;
		name: string;
		hidden?: boolean;
		class?: string;
		postfix?: string;
		superForm: SuperFormData<any>;
		errors: SuperFormErrors<Record<string, string>>;
	} = $props();
</script>

<fieldset class={`fieldset ${className}`}>
	<legend class="fieldset-legend" class:hidden
		>{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>
	<label class="input w-full" class:hidden>
		{#if icon}
			<span class={`text-xl ${icon}`}></span>
		{/if}
		<input {name} bind:value={$superForm[name]} {...restInputAttr} />
		{#if postfix}
			<span class="ml-2 font-black text-primary-content italic">{postfix}</span>
		{/if}
	</label>
	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
