<script lang="ts">
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import MultiImageUploader, { type MultiImageUploaderProps } from './MultiImageUploader.svelte';
	import ToolTip from './ToolTip.svelte';

	let {
		label,
		help = '',
		superForm,
		errors,
		name,
		class: className = '',
		...restAttr
	}: MultiImageUploaderProps & {
		label: string;
		help?: string;
		name: string;
		class?: string;
		superForm: SuperFormData<any>;
		errors: any;
	} = $props();
</script>

<fieldset class={`fieldset flex flex-col ${className} min-h-39`}>
	<legend class="fieldset-legend">
		{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>

	<MultiImageUploader {name} bind:value={$superForm[name]} {...restAttr} />

	{#if $errors[name]}
		{#each $errors[name]._errors as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
