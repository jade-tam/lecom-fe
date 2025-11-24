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
		<div class={`w-full rounded-full`}>
			<span class="loading loading-xl loading-spinner"></span>
		</div>
	{:else if avatar_url}
		<div class={`w-full rounded-full`}>
			<img src={avatar_url} alt="avatar" />
		</div>
	{:else}
		<div class={`[container-type:size] w-full rounded-full bg-secondary text-neutral-content`}>
			<span class="text-[40cqw] font-black text-secondary-content">{letter}</span>
		</div>
	{/if}
</div>
