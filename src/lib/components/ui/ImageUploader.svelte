<script lang="ts">
	import { cropFileToFormData } from '$lib/utils/imageConverter';
	import showToast from '$lib/utils/showToast';
	import Cropper, { type OnCropCompleteEvent } from 'svelte-easy-crop';

	let {
		name,
		value = $bindable(''),
		aspectRatio,
		maxSizeMB = 5,
		icon,
		placeholder
	}: {
		name: string;
		value: string;
		icon: string;
		aspectRatio?: number;
		maxSizeMB?: number;
		placeholder: string;
	} = $props();

	let fileInput: HTMLInputElement | null = $state(null);
	let modal: HTMLDialogElement | null = $state(null);

	let selectedFile: File | null = $state(null);
	let imageSrc: string | null = $state(null);
	let uploading = $state(false);

	// cropper state (svelte-easy-crop)
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let pixelCrop: { x: number; y: number; width: number; height: number } | null = $state(null);

	// ============================================================================================
	function openFilePicker() {
		fileInput?.click();
	}

	// ============================================================================================
	function onFileSelected(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		if (file.size > maxSizeMB * 1024 * 1024) {
			alert(`File too large (max ${maxSizeMB} MB)`);
			return;
		}

		selectedFile = file; // << keep the raw File
		const reader = new FileReader();
		reader.onload = () => {
			imageSrc = reader.result as string;
			modal?.showModal();
		};
		reader.readAsDataURL(file);
	}

	// ============================================================================================
	// `cropcomplete` event handler from svelte-easy-crop -> capture pixel crop
	function handleCropComplete(event: OnCropCompleteEvent) {
		const { percent, pixels } = event;

		pixelCrop = {
			x: Math.round(pixels.x),
			y: Math.round(pixels.y),
			width: Math.max(1, Math.round(pixels.width)),
			height: Math.max(1, Math.round(pixels.height))
		};
	}

	// ============================================================================================
	function cancelCrop() {
		modal?.close();
		imageSrc = null;
	}

	// ============================================================================================
	async function cropAndUpload() {
		if (!selectedFile || !pixelCrop) return;

		uploading = true;

		try {
			const { formData, file, dataUrl } = await cropFileToFormData(selectedFile, pixelCrop, {
				mime: 'image/jpeg',
				quality: 0.9,
				devicePixelRatio: 1,
				maxWidth: 1024,
				autoFixOrientation: true,
				fileName: 'avatar.jpg'
			});

			const response = await fetch('/api/upload/image', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const responseBody = await response.json();
				value = responseBody.result.url;
				modal?.close();
				imageSrc = null;
				selectedFile = null;
			}
		} catch (err) {
			console.error(err);
			showToast({ type: 'error', description: String(err) });
		} finally {
			uploading = false;
		}
	}
</script>

<!-- Hidden File Input -->
<input
	type="file"
	accept="image/*"
	class="hidden"
	bind:this={fileInput}
	onchange={onFileSelected}
/>

<!-- Hidden Form Field which contains url Input -->
<input type="text" class="hidden" bind:value {name} />

<!-- Image Display -->
<button type="button" class="btn overflow-hidden p-0 h-full w-full" onclick={openFilePicker}>
	{#if value}
		<img src={value} alt={name} class="h-full w-full object-cover" />
	{:else}
		<div class="flex flex-col items-center gap-2 opacity-60">
			<span class="{icon} text-xl"></span>
			<span class="text-sm">{placeholder}</span>
			<span class="text-xs">Maximum size {maxSizeMB} MB</span>
		</div>
	{/if}

	{#if uploading}
		<div class="absolute inset-0 flex items-center justify-center bg-base-200/70">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{/if}
</button>

<!-- Crop Modal -->
<dialog bind:this={modal} class="modal">
	<div class="modal-box flex h-[70vh] w-[90vw] max-w-2xl flex-col gap-4">
		<h3 class="font-bold">Crop image</h3>

		{#if imageSrc}
			<div class="relative flex-1 overflow-hidden rounded-selector bg-base-100">
				<Cropper
					image={imageSrc}
					bind:crop
					bind:zoom
					aspect={aspectRatio}
					oncropcomplete={handleCropComplete}
				/>
			</div>

			<div class="flex items-center gap-4">
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

				<div class="ml-auto flex items-center gap-2">
					<button class="btn btn-ghost" onclick={cancelCrop} disabled={uploading}>Cancel</button>
					<button class="btn btn-primary" onclick={cropAndUpload} disabled={uploading}>
						{#if uploading}Uploading...{:else}Crop & Upload{/if}
					</button>
				</div>
			</div>
		{:else}
			<p>No image selected.</p>
			<div class="modal-action">
				<button class="btn" onclick={() => modal?.close()}>Close</button>
			</div>
		{/if}
	</div>
</dialog>
