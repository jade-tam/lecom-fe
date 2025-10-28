<script lang="ts">
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import ImageUploader from './ImageUploader.svelte';
	import ToolTip from './ToolTip.svelte';

	let {
		label,
		icon = '',
		help = '',
		placeholder = 'Upload image',
		superForm,
		errors,
		name,
		hidden = false,
		class: className = '',
		aspectRatio = 1
	}: {
		aspectRatio?: number;
		placeholder?: string;
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

<fieldset class={`fieldset flex flex-col ${className} min-h-39`} class:hidden>
	<legend class="fieldset-legend"
		>{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>
	<ImageUploader {aspectRatio} {placeholder} bind:value={$superForm[name]} {name} {icon} />
	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
