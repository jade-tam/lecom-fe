<script lang="ts">
	import type { SuperFormData } from 'sveltekit-superforms/client';
	import MultiImageUploader, { type MultiImageUploaderProps } from './MultiImageUploader.svelte';
	import ToolTip from './ToolTip.svelte';
	import MultiImageUploaderUrl from './MultiImageUploaderUrl.svelte';

	let {
		label,
		help = '',
		superForm,
		errors,
		name,
		class: className = '',
		isUrlOnly = false,
		...restAttr
	}: MultiImageUploaderProps & {
		label: string;
		help?: string;
		name: string;
		class?: string;
		superForm: SuperFormData<any>;
		errors: any;
		isUrlOnly?: boolean;
	} = $props();
</script>

<fieldset class={`fieldset flex flex-col ${className} min-h-39`}>
	<legend class="fieldset-legend">
		{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>

	{#if isUrlOnly}
		<MultiImageUploaderUrl bind:value={$superForm[name]} {...restAttr} />
	{:else}
		<MultiImageUploader bind:value={$superForm[name]} {...restAttr} />
	{/if}

	{#if $errors[name]}
		{#each $errors[name]._errors as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
