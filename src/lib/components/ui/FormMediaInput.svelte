<script lang="ts">
	import type { SuperFormData, SuperFormErrors } from 'sveltekit-superforms/client';
	import MediaUploader from './MediaUploader.svelte';
	import ToolTip from './ToolTip.svelte';

	let {
		label,
		icon = '',
		help = '',
		placeholder = 'Upload file',
		superForm,
		errors,
		name,
		hidden = false,
		class: className = '',
		aspectRatio = 1,
		mediaType = 'Image' // "Image" | "Video" | "Document"
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
		mediaType?: 'Image' | 'Video' | 'Document';
	} = $props();
</script>

<fieldset class={`fieldset flex flex-col ${className} min-h-39`} class:hidden>
	<legend class="fieldset-legend">
		{label}
		{#if help}
			<ToolTip tip={help} />
		{/if}
	</legend>

	<!-- Forward mediaType and other props to MediaUploader -->
	<MediaUploader
		{aspectRatio}
		{placeholder}
		bind:value={$superForm[name]}
		{name}
		{icon}
		{mediaType}
		maxSizeMB={mediaType === 'Video' ? 200 : undefined}
	/>

	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
