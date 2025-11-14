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
		buttonClass = '',
		aspectRatio,
		mediaType = 'Image', // "Image" | "Video" | "Document"
		onUploadSuccess
	}: {
		aspectRatio: '1:1' | '16:9';
		placeholder?: string;
		label: string;
		icon?: string;
		help?: string;
		name: string;
		hidden?: boolean;
		class?: string;
		buttonClass?: string;
		superForm: SuperFormData<any>;
		errors: SuperFormErrors<Record<string, string>>;
		mediaType?: 'Image' | 'Video' | 'Document';
		onUploadSuccess?: (data: { url: string; file: File; duration?: number }) => void;
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
		{buttonClass}
		maxSizeMB={mediaType === 'Video' ? 8 : undefined}
		{onUploadSuccess}
	/>

	{#if $errors[name]}
		{#each $errors[name] as error}
			<p class="text-error">{error}</p>
		{/each}
	{/if}
</fieldset>
