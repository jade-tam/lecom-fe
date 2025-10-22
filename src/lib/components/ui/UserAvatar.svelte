<script lang="ts">
	const {
		isImageUploading = false,
		avatar_url,
		letter,
		sizeClass = 'h-10 w-10'
	}: {
		isImageUploading?: boolean;
		avatar_url: string | null;
		letter: string;
		sizeClass?: string;
	} = $props();
</script>

<div
	class={`avatar-online avatar ${avatar_url ? '' : 'avatar-placeholder'} ${sizeClass} rounded-full border`}
>
	{#if isImageUploading}
		<div class={`rounded-full`}>
			<span class="loading loading-xl loading-spinner"></span>
		</div>
	{:else if avatar_url}
		<div class={`rounded-full`}>
			<img src={avatar_url} alt="avatar" />
		</div>
	{:else}
		<div class={`rounded-full bg-secondary text-neutral-content`}>
			<span class="text-sm font-black text-secondary-content">{letter}</span>
		</div>
	{/if}
</div>
