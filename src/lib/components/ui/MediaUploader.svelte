<script lang="ts">
	import Cropper, { type OnCropCompleteEvent } from 'svelte-easy-crop';
	import { cropFileToFormData } from '$lib/utils/imageConverter';
	import showToast from '$lib/utils/showToast';

	let {
		name,
		buttonClass,
		value = $bindable(''),
		aspectRatio,
		maxSizeMB = 5,
		icon,
		placeholder,
		mediaType = 'Image', // "Image" | "Video" | "Document",
		onUploadSuccess
	}: {
		buttonClass: string;
		name: string;
		value: string;
		icon: string;
		aspectRatio: '1:1' | '16:9';
		maxSizeMB?: number;
		placeholder: string;
		mediaType?: 'Image' | 'Video' | 'Document';
		onUploadSuccess?: (data: { url: string; file: File; duration?: number }) => void;
	} = $props();

	// elements & local state
	let fileInput: HTMLInputElement | null = $state(null);
	let modal: HTMLDialogElement | null = $state(null);

	let selectedFile: File | null = $state(null);
	let imageSrc: string | null = $state(null); // data URL for crop preview (images only)
	let uploading = $state(false);
	let errorMessage: string | null = $state(null);

	// cropper state
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let pixelCrop: { x: number; y: number; width: number; height: number } | null = $state(null);

	// ---- accept attribute based on mediaType
	const acceptAttr = $derived(
		mediaType === 'Image'
			? 'image/*'
			: mediaType === 'Video'
				? 'video/*'
				: '.pdf,.doc,.docx,.xls,.xlsx,.csv,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain'
	);

	// ---- endpoint mapping
	const uploadEndpoint = $derived(
		mediaType === 'Video'
			? '/api/upload/video'
			: mediaType === 'Document'
				? '/api/upload/document'
				: '/api/upload/image'
	);

	// ============================================================================================
	function openFilePicker() {
		if (uploading) return;
		fileInput?.click();
	}

	// ============================================================================================
	async function onFileSelected(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		if (file.size > maxSizeMB * 1024 * 1024) {
			showToast({ type: 'error', description: `File quá lớn (tối đa ${maxSizeMB} MB)` });
			return;
		}

		selectedFile = file;

		// Images: prepare dataURL preview and open crop modal
		if (mediaType === 'Image') {
			const reader = new FileReader();
			reader.onload = () => {
				imageSrc = reader.result as string;
				// reset crop state
				crop = { x: 0, y: 0 };
				zoom = 1;
				pixelCrop = null;
				// show crop modal
				setTimeout(() => modal?.showModal(), 0);
			};
			reader.readAsDataURL(file);
			return;
		}

		// Video / Document: upload immediately
		uploading = true;
		errorMessage = null;
		try {
			const form = new FormData();
			form.append('file', file);

			const resp = await fetch(uploadEndpoint, { method: 'POST', body: form });
			if (!resp.ok) throw new Error(await resp.text());

			const body = await resp.json().catch(() => null);
			const remoteUrl = body?.result?.url || body?.url || body?.data?.url || null;

			const finalUrl = remoteUrl ?? URL.createObjectURL(file);
			value = finalUrl;

			// ✅ if it's a video, get duration before clearing
			let duration: number | undefined;
			if (mediaType === 'Video') {
				duration = await getVideoDuration(file);
			}

			// ✅ Trigger external callback
			onUploadSuccess?.({ url: finalUrl, file, duration });

			selectedFile = null;
		} catch (err: any) {
			console.error(err);
			errorMessage = String(err?.message ?? err);
			showToast({ type: 'error', description: 'Có lỗi xảy ra trong quá trình tải lên' });
		} finally {
			uploading = false;
		}
	}

	async function getVideoDuration(file: File): Promise<number | undefined> {
		return new Promise((resolve) => {
			try {
				const video = document.createElement('video');
				video.preload = 'metadata';
				video.onloadedmetadata = () => {
					URL.revokeObjectURL(video.src);
					const duration = Math.round(video.duration); // ✅ round to nearest second
					resolve(isFinite(duration) ? duration : undefined);
				};
				video.onerror = () => resolve(undefined);
				video.src = URL.createObjectURL(file);
			} catch {
				resolve(undefined);
			}
		});
	}

	// ============================================================================================
	// crop complete handler for svelte-easy-crop; it calls with plain object
	function handleCropComplete(event: OnCropCompleteEvent) {
		const { pixels } = event;
		pixelCrop = {
			x: Math.round(pixels.x),
			y: Math.round(pixels.y),
			width: Math.max(1, Math.round(pixels.width)),
			height: Math.max(1, Math.round(pixels.height))
		};
	}

	function cancelCrop() {
		if (uploading) return;
		modal?.close();
		imageSrc = null;
		selectedFile = null;
		pixelCrop = null;
		errorMessage = null;
	}

	// ============================================================================================
	// crop + upload flow for images
	async function cropAndUpload() {
		if (!selectedFile) {
			showToast({ type: 'error', description: 'Chưa có file nào được chọn.' });
			return;
		}
		if (!pixelCrop) {
			showToast({ type: 'error', description: 'Vui lòng điều chỉnh vùng cắt trước khi tải lên.' });
			return;
		}

		uploading = true;
		errorMessage = null;

		try {
			const {
				formData,
				file: outFile,
				dataUrl
			} = await cropFileToFormData(selectedFile, pixelCrop, {
				mime: 'image/jpeg',
				quality: 0.9,
				devicePixelRatio: 1,
				maxWidth: 1024,
				autoFixOrientation: true,
				fileName: selectedFile
					? selectedFile.name.replace(/\.[^/.]+$/, '') + '.jpg'
					: `upload_${Date.now()}.jpg`,
				formFieldName: 'file'
			});

			const resp = await fetch(uploadEndpoint, {
				method: 'POST',
				body: formData
			});

			if (!resp.ok) {
				const text = await resp.text().catch(() => 'Upload failed');
				throw new Error(text || `Upload failed: ${resp.status}`);
			}

			const body = await resp.json().catch(() => null);
			const remoteUrl =
				(body && body.result && body.result.url) ||
				(body && body.url) ||
				(body && body.data && body.data.url) ||
				null;

			if (remoteUrl) value = remoteUrl;
			else value = dataUrl; // fallback to local preview

			// DO thing with success function
			onUploadSuccess?.({
				url: remoteUrl ?? dataUrl,
				file: outFile
			});

			// cleanup
			modal?.close();
			imageSrc = null;
			selectedFile = null;
			pixelCrop = null;
		} catch (err: any) {
			console.error(err);
			errorMessage = String(err?.message ?? err);
			showToast({ type: 'error', description: errorMessage });
			// keep modal open so user can retry or cancel
		} finally {
			uploading = false;
		}
	}
</script>

<!-- Hidden File Input -->
<input
	type="file"
	accept={acceptAttr}
	class="hidden"
	bind:this={fileInput}
	onchange={onFileSelected}
/>

<!-- Hidden Form Field which contains url Input (bind to value so parent form gets updated) -->
<input type="text" class="hidden" bind:value {name} />

<!-- Display / trigger -->
<button
	type="button"
	class="btn relative aspect-square flex-1 overflow-hidden p-0 {buttonClass} {aspectRatio === '1:1'
		? 'aspect-square'
		: 'aspect-video'}"
	onclick={openFilePicker}
>
	{#if value}
		{#if mediaType === 'Image'}
			<img src={value} alt={name} class="h-full w-full object-cover" />
		{:else if mediaType === 'Video'}
			<!-- video preview using <video> tag if possible -->
			<video src={value} class="h-full w-full object-cover" controls muted playsinline></video>
		{:else}
			<!-- document: show icon and filename or placeholder -->
			<div class="flex flex-col items-center justify-center gap-2 p-4">
				<span class={icon + ' text-xl'}></span>
				<span class="text-center text-sm break-words">{value.split('/').pop() ?? ''}</span>
			</div>
		{/if}
	{:else}
		<div class="flex flex-col items-center justify-center gap-2 p-4 opacity-60">
			<span class={icon + ' text-xl'}></span>
			<span class="text-sm">{placeholder}</span>
			<span class="text-xs">Kích thước tối đa {maxSizeMB} MB</span>
		</div>
	{/if}

	{#if uploading}
		<div class="absolute inset-0 flex items-center justify-center bg-base-200/70">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{/if}
</button>

<!-- Crop Modal: only used for images -->
<dialog
	bind:this={modal}
	class="modal"
	oncancel={() => {
		if (!uploading) cancelCrop();
	}}
>
	<div class="modal-box flex h-[70vh] w-[90vw] max-w-2xl flex-col gap-4">
		<h3 class="font-bold">Cắt ảnh trước khi tải lên</h3>

		{#if imageSrc}
			<div class="relative flex-1 overflow-hidden rounded-selector bg-base-100">
				<Cropper
					image={imageSrc}
					bind:crop
					bind:zoom
					aspect={aspectRatio === '1:1' ? 1 : 1.77}
					oncropcomplete={handleCropComplete}
					maxZoom={5}
				/>
			</div>

			<div class="flex items-center gap-4">
				<div class="w-full max-w-24">
					<input
						type="range"
						min="1"
						max="5"
						bind:value={zoom}
						class="range range-secondary range-sm"
						step="0.05"
					/>
					<div class="flex justify-between text-xs">
						<span>1x</span>
						<span>2x</span>
						<span>3x</span>
						<span>4x</span>
						<span>5x</span>
					</div>
				</div>

			<div class="ml-auto flex items-center gap-2">
				<button class="btn btn-ghost" onclick={cancelCrop} disabled={uploading}>Hủy</button>
				<button class="btn btn-primary" onclick={cropAndUpload} disabled={uploading}>
					{#if uploading}Đang tải lên...{:else}Cắt hình & Tải lên{/if}
				</button>
			</div>
			</div>

			{#if errorMessage}
				<p class="mt-2 text-error">{errorMessage}</p>
			{/if}
		{:else}
			<p>Chưa chọn ảnh nào.</p>
			<div class="modal-action">
				<button class="btn" onclick={() => modal?.close()}>Đóng</button>
			</div>
		{/if}
	</div>
</dialog>
