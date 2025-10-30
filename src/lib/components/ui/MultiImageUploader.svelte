<script lang="ts">
	import type { ProductImageData } from '$lib/types/Product';
	import { cropAndUploadImage, uploadSingleImage } from '$lib/utils/imageUploader';
	import { dragHandle, dragHandleZone } from 'svelte-dnd-action';
	import type { OnCropCompleteEvent } from 'svelte-easy-crop';
	import Cropper from 'svelte-easy-crop';
	import { fade } from 'svelte/transition';

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
	let cropModal: HTMLDialogElement | null = $state(null);
	let imageSrc: string | null = $state(null);
	let selectedFile: File | null = $state(null);
	let pixelCrop: { x: number; y: number; width: number; height: number } | null = $state(null);
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);

	// Local working copy for DnD + uploads
	let localImages: (ProductImageData & { id: string })[] = $state([]);

	$effect(() => {
		// Only initialize once or when value changes length (like on form reset)
		if (value?.length && localImages.length === 0) {
			localImages = value.map((img) => ({
				...img,
				id: crypto.randomUUID() // ensure unique key for each item
			}));
		}
	});

	$effect(() => console.log('Synced form value:', value));

	// Sync helper to push local changes back into the form's bound value
	function syncToForm() {
		value = localImages.map(({ id, ...img }) => img);
	}

	// =============================================================================
	function openFilePicker() {
		if (uploading) return;
		fileInput?.click();
	}

	// =============================================================================
	async function onFileSelected(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		// Open crop modal
		const reader = new FileReader();
		reader.onload = () => {
			imageSrc = reader.result as string;
			selectedFile = file;
			setTimeout(() => cropModal?.showModal(), 0);
		};
		reader.readAsDataURL(file);
	}

	// =============================================================================
	function handleCropComplete(e: OnCropCompleteEvent) {
		const { pixels } = e;
		pixelCrop = {
			x: Math.round(pixels.x),
			y: Math.round(pixels.y),
			width: Math.round(pixels.width),
			height: Math.round(pixels.height)
		};
	}

	// =============================================================================
	async function cropAndUpload() {
		if (!selectedFile || !pixelCrop) return;
		uploading = true;

		try {
			const url = await cropAndUploadImage({
				file: selectedFile,
				cropAreaPixels: pixelCrop,
				maxSizeMB: maxFileSize
			});

			localImages = [
				...localImages,
				{
					id: crypto.randomUUID(),
					url,
					orderIndex: localImages.length,
					isPrimary: localImages.length === 0
				}
			];

			syncToForm();
		} catch (err) {
			console.error(err);
		} finally {
			uploading = false;
			cropModal?.close();
			resetCropState();
		}
	}

	// =============================================================================
	function resetCropState() {
		imageSrc = null;
		selectedFile = null;
		pixelCrop = null;
		crop = { x: 0, y: 0 };
		zoom = 1;
		uploading = false;
		if (fileInput) fileInput.value = ''; // allow same file reselect
	}

	// =============================================================================
	function cancelCrop() {
		if (uploading) return;
		cropModal?.close();
		resetCropState();
	}

	// =============================================================================
	function removeImage(index: number) {
		localImages = localImages
			.filter((_, i) => i !== index)
			.map((img, i) => ({ ...img, orderIndex: i }));
		syncToForm();
	}

	// =============================================================================
	function handleDndTrigger(e: CustomEvent) {
		const { items }: { items: (ProductImageData & { id: string })[] } = e.detail;
		localImages = items.map((item: ProductImageData & { id: string }, i) => ({
			...item,
			orderIndex: i,
			isPrimary: i === 0
		}));
		syncToForm();
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

<!-- Crop Modal -->
<dialog bind:this={cropModal} class="modal">
	<div class="modal-box flex h-[70vh] w-[90vw] max-w-2xl flex-col gap-4">
		<h3 class="font-bold">Crop image</h3>
		{#if imageSrc}
			<div class="relative flex-1 overflow-hidden rounded-field bg-base-200">
				<Cropper
					image={imageSrc}
					bind:crop
					bind:zoom
					aspect={aspectRatio === '1:1' ? 1 : 1.77}
					oncropcomplete={handleCropComplete}
				/>
			</div>
			<div class="flex items-center justify-between gap-4">
				<div class="w-full max-w-24">
					<input
						type="range"
						min="1"
						max="3"
						bind:value={zoom}
						class="range range-secondary range-sm"
						step="0.02"
					/>
					<div class="flex justify-between text-xs">
						<span>1x</span>
						<span>2x</span>
						<span>3x</span>
					</div>
				</div>

				<div class="ml-auto flex gap-2">
					<button class="btn btn-ghost" onclick={() => cancelCrop()} disabled={uploading}>
						Cancel
					</button>
					<button class="btn btn-primary" onclick={cropAndUpload} disabled={uploading}>
						{#if uploading}Uploading...{:else}Crop & Upload{/if}
					</button>
				</div>
			</div>
		{:else}
			<p>No image selected.</p>
		{/if}
	</div>
</dialog>

<!-- Image grid -->
<div
	class="flex flex-wrap gap-2"
	use:dragHandleZone={{
		items: localImages,
		flipDurationMs: 200,
		dropTargetClasses: ['outline-secondary', 'outline-2', 'rounded-field'],
		dropTargetStyle: {},
		dragDisabled: uploading
	}}
	onconsider={handleDndTrigger}
	onfinalize={handleDndTrigger}
>
	{#each localImages as item, i (item.id)}
		<div class="group relative h-32 w-32 overflow-hidden rounded-lg border outline-primary">
			<img
				use:dragHandle
				src={item.url}
				alt="product"
				class="h-full w-full object-cover"
				draggable="false"
			/>

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
