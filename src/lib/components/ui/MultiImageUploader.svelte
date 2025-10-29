<script lang="ts">
	import type { ProductImageData } from '$lib/types/Products';
	import { uploadSingleImage } from '$lib/utils/imageUploader';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones, dndzone } from 'svelte-dnd-action';
	import { fade } from 'svelte/transition';

	overrideItemIdKeyNameBeforeInitialisingDndZones('url');

	export type MultiImageUploaderProps = {
		name: string;
		value?: ProductImageData[];
		maxImages?: number;
		maxFileSize?: number;
		uploadButtonLabel?: string;
		uploadButtonIcon?: string;
		uploadButtonClass?: string;
		aspectRatio?: '1:1' | '16:9';
	};

	let {
		name,
		value = $bindable([]),
		maxImages = 6,
		maxFileSize = 5,
		uploadButtonLabel = 'Upload image',
		uploadButtonIcon = 'icon-[fa7-solid--image]',
		uploadButtonClass = '',
		aspectRatio = '1:1'
	}: MultiImageUploaderProps = $props();

	let fileInput: HTMLInputElement | null = $state(null);
	let uploading = $state(false);

	// =============================================================================
	function openFilePicker() {
		if (uploading) return;
		fileInput?.click();
	}

	// =============================================================================
	async function onFileSelected(e: Event) {
		const files = (e.target as HTMLInputElement).files;
		if (!files?.length) return;

		uploading = true;

		for (const file of Array.from(files)) {
			const url = await uploadSingleImage(file, { maxSizeMB: maxFileSize });

			if (url) {
				const newItem = {
					url,
					orderIndex: value.length,
					isPrimary: value.length === 0
				};
				value = [...value, newItem];
			}
		}

		uploading = false;

		// clear file input so selecting same file again works
		if (fileInput) fileInput.value = '';
	}

	// =============================================================================
	function removeImage(index: number) {
		value = value.filter((_, i) => i !== index).map((img, i) => ({ ...img, orderIndex: i }));
	}

	// =============================================================================
	function handleDndTrigger({ detail }: CustomEvent) {
		const { items } = detail;

		// items is an array of our ImageItem reordered
		value = items.map((item: ProductImageData, i: number) => ({
			...item,
			orderIndex: i,
			isPrimary: i === 0
		}));
	}
</script>

<!-- File input -->
<input
	type="file"
	accept="image/*"
	class="hidden"
	bind:this={fileInput}
	onchange={onFileSelected}
	multiple
/>

<!-- Hidden input, store values used for form data -->
<input type="hidden" {name} value={JSON.stringify(value)} />

<!-- Image grid -->
<div
	class="flex flex-wrap gap-2"
	use:dndzone={{
		items: value,
		flipDurationMs: 200,
		dropTargetClasses: ['outline-secondary', 'outline-2', 'rounded-field'],
		dropTargetStyle: {}
	}}
	onconsider={handleDndTrigger}
	onfinalize={handleDndTrigger}
>
	{#each value as item, i (item.url)}
		<div class="group relative h-32 w-32 overflow-hidden rounded-lg border outline-primary">
			<img src={item.url} alt="product" class="h-full w-full object-cover" draggable="false" />

			<!-- Top-right remove button -->
			<button
				type="button"
				class="btn absolute top-1 right-1 btn-circle opacity-0 transition btn-xs btn-error group-hover:opacity-100"
				onclick={() => removeImage(i)}
				aria-label="remove image"
			>
				<span class="icon-[fa7-solid--trash-alt]"></span>
			</button>

			<!-- Primary indicator -->
			{#if item.isPrimary}
				<div transition:fade class="absolute top-1 left-1 badge badge-xs badge-primary">
					Primary
				</div>
			{/if}
		</div>
	{/each}

	<!-- Upload Button -->
	{#if value.length < maxImages}
		<button
			type="button"
			class="btn flex h-32 grow flex-col {uploadButtonClass}"
			onclick={openFilePicker}
		>
			<span class="{uploadButtonIcon} text-xl"></span>
			<span class="text-sm">{uploadButtonLabel} {value.length}/{maxImages}</span>
			<span class="text-xs">Maximum size {maxFileSize} MB</span>
		</button>
	{/if}
</div>
