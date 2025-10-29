<script lang="ts">
	import type { HTMLInputAttributes, HTMLTextareaAttributes } from 'svelte/elements';
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
		class: className = '',
		...restAttr
	}: HTMLTextareaAttributes & {
		label: string;
		icon?: string;
		help?: string;
		name: string;
		hidden?: boolean;
		class?: string;
		superForm: SuperFormData<any>;
		errors: SuperFormErrors<Record<string, string>>;
	} = $props();
</script>

<fieldset class={`fieldset ${className}`} class:hidden>
	<legend class="fieldset-legend"
		>{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>
	<textarea
		class="textarea w-full"
		{name}
		bind:value={$superForm[name]}
		{...restAttr}
	></textarea>
	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
