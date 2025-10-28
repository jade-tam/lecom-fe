import type { CropArea } from 'svelte-easy-crop';

type CropToFormDataOptions = {
	mime?: string; // default 'image/jpeg'
	quality?: number; // [0..1], default 0.92
	devicePixelRatio?: number; // default 1
	maxWidth?: number; // optional
	maxHeight?: number; // optional
	fileName?: string; // optional
	formFieldName?: string; // default 'file'
	autoFixOrientation?: boolean; // default true -- read EXIF and rotate/flip before cropping
};

/** Read a File/Blob into ArrayBuffer */
async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
	return await blob.arrayBuffer();
}

/** Read EXIF Orientation from ArrayBuffer (returns 1..8 or 1 if not found) */
function readExifOrientation(arrayBuffer: ArrayBuffer): number {
	const view = new DataView(arrayBuffer);
	// check JPEG magic
	if (view.getUint16(0, false) !== 0xffd8) return 1;
	let offset = 2;
	const length = view.byteLength;

	while (offset < length) {
		const marker = view.getUint16(offset, false);
		offset += 2;
		// APP1 marker (0xFFE1) used by EXIF
		if (marker === 0xffe1) {
			offset += 2;
			// check EXIF header "Exif\0\0"
			if (
				view.getUint32(offset, false) !== 0x45786966 /* 'Exif' */ ||
				view.getUint16(offset + 4, false) !== 0x0000
			) {
				break;
			}
			offset += 6; // move past "Exif\0\0"

			// TIFF header
			const little = view.getUint16(offset, false) === 0x4949;
			if (!little && view.getUint16(offset, false) !== 0x4d4d) {
				break;
			}
			offset += 2;
			const tagMark = view.getUint16(offset, little);
			offset += 2;
			if (tagMark !== 0x002a) break;
			const firstIFDOffset = view.getUint32(offset, little);
			let ifdOffset = offset - 4 + firstIFDOffset;
			const entries = view.getUint16(ifdOffset, little);
			ifdOffset += 2;
			for (let i = 0; i < entries; i++) {
				const entryOffset = ifdOffset + i * 12;
				const tag = view.getUint16(entryOffset, little);
				if (tag === 0x0112) {
					// Orientation tag
					const type = view.getUint16(entryOffset + 2, little);
					const numValues = view.getUint32(entryOffset + 4, little);
					const valOffset = entryOffset + 8;
					if (type === 3 && numValues === 1) {
						const orientation = view.getUint16(valOffset, little);
						return orientation;
					} else if (type === 3 && numValues > 1) {
						const actualOffset = view.getUint32(valOffset, little);
						return view.getUint16(offset - 4 + actualOffset, little);
					}
				}
			}
			break;
		} else {
			// not APP1, skip
			const size = view.getUint16(offset, false);
			offset += size;
		}
	}
	return 1;
}

/** Apply EXIF transform to canvas context before drawing (orientation 1..8) */
function applyOrientationTransform(
	ctx: CanvasRenderingContext2D,
	orientation: number,
	width: number,
	height: number
) {
	switch (orientation) {
		case 2: // flip horizontal
			ctx.translate(width, 0);
			ctx.scale(-1, 1);
			break;
		case 3: // rotate 180
			ctx.translate(width, height);
			ctx.rotate(Math.PI);
			break;
		case 4: // flip vertical
			ctx.translate(0, height);
			ctx.scale(1, -1);
			break;
		case 5: // transpose (flip + rotate 90)
			ctx.rotate(0.5 * Math.PI);
			ctx.scale(1, -1);
			break;
		case 6: // rotate 90
			ctx.rotate(0.5 * Math.PI);
			ctx.translate(0, -height);
			break;
		case 7: // transverse
			ctx.rotate(-0.5 * Math.PI);
			ctx.scale(1, -1);
			break;
		case 8: // rotate -90
			ctx.rotate(-0.5 * Math.PI);
			ctx.translate(-width, 0);
			break;
		default: // 1: no transform
			break;
	}
}

/**
 * Main helper: crop a File/Blob with EXIF handling and return upload-ready FormData + dataUrl
 */
export async function cropFileToFormData(
	imageFile: File | Blob,
	crop: CropArea,
	opts: CropToFormDataOptions = {}
): Promise<{ formData: FormData; file: File; blob: Blob; dataUrl: string }> {
	const {
		mime = 'image/jpeg',
		quality = 0.92,
		devicePixelRatio = 1,
		maxWidth,
		maxHeight,
		fileName,
		formFieldName = 'file',
		autoFixOrientation = true
	} = opts;

	// Read EXIF orientation if requested
	let orientation = 1;
	if (autoFixOrientation) {
		try {
			const arr = await blobToArrayBuffer(imageFile);
			orientation = readExifOrientation(arr) || 1;
		} catch (e) {
			console.warn('Could not read EXIF orientation, defaulting to 1', e);
			orientation = 1;
		}
	}

	// Load image element from File/Blob
	const img = await new Promise<HTMLImageElement>((resolve, reject) => {
		const url = URL.createObjectURL(imageFile);
		const i = new Image();
		i.onload = () => {
			URL.revokeObjectURL(url);
			resolve(i);
		};
		i.onerror = (err) => {
			URL.revokeObjectURL(url);
			reject(err);
		};
		i.src = url;
	});

	// Original pixel sizes
	const srcW = img.naturalWidth;
	const srcH = img.naturalHeight;

	// clamp crop to bounds
	const sx = Math.max(0, Math.min(srcW, Math.round(crop.x)));
	const sy = Math.max(0, Math.min(srcH, Math.round(crop.y)));
	const sw = Math.max(1, Math.min(srcW - sx, Math.round(crop.width)));
	const sh = Math.max(1, Math.min(srcH - sy, Math.round(crop.height)));

	// Determine output logical size (before DPR)
	let outW = sw;
	let outH = sh;

	if (maxWidth || maxHeight) {
		const ratio = outW / outH;
		if (maxWidth && outW > maxWidth) {
			outW = maxWidth;
			outH = Math.round(maxWidth / ratio);
		}
		if (maxHeight && outH > maxHeight) {
			outH = maxHeight;
			outW = Math.round(maxHeight * ratio);
		}
	}

	// For orientation that swaps width/height (rotated 90/270), canvas logical size must swap
	const orientationSwaps = (o: number) => [5, 6, 7, 8].includes(o);
	const canvasLogicalW = orientationSwaps(orientation) ? outH : outW;
	const canvasLogicalH = orientationSwaps(orientation) ? outW : outH;

	// Create canvas sized with DPR
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(canvasLogicalW * devicePixelRatio));
	canvas.height = Math.max(1, Math.round(canvasLogicalH * devicePixelRatio));
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');

	// scale to account for DPR (so we can use logical coordinates)
	if (devicePixelRatio !== 1) {
		ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
	} else {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	// Save context and apply orientation transforms *on logical canvas size*
	ctx.save();
	// For orientation transforms, apply transform relative to logical canvas width/height
	applyOrientationTransform(ctx, orientation, canvasLogicalW, canvasLogicalH);

	// Now drawImage with appropriate source and destination mapping.
	// Because we already applied transform, we should draw into logical (outW x outH) rectangle.
	// For transforms that swapped width/height, we still draw with destination logical width/height.
	// drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
	ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

	ctx.restore();

	// Convert to Blob
	const blob: Blob = await new Promise((resolve) => {
		canvas.toBlob((b) => resolve(b ?? new Blob()), mime, quality);
	});

	const finalFileName = fileName ?? `upload_${Date.now()}.${mime === 'image/png' ? 'png' : 'jpg'}`;
	const file = new File([blob], finalFileName, { type: blob.type || mime });

	const formData = new FormData();
	formData.append(formFieldName, file);

	// data url for preview
	const dataUrl = await new Promise<string>((resolve) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.readAsDataURL(blob);
	});

	return { formData, file, blob, dataUrl };
}
