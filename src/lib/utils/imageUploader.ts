import showToast from '$lib/utils/showToast';
import { cropFileToFormData } from './imageConverter';

type UploadOptions = {
	maxSizeMB?: number;
	aspectRatio?: '1:1' | '16:9';
	endpoint?: string;
	enableCrop?: boolean;
};

export async function uploadSingleImage(
	file: File,
	options: UploadOptions
): Promise<string | null> {
	const { maxSizeMB = 5, endpoint = '/api/upload/image' } = options;

	if (file.size > maxSizeMB * 1024 * 1024) {
		showToast({ type: 'error', description: `File too large (max ${maxSizeMB} MB)` });
		return null;
	}

	try {
		// simple direct upload (no crop)
		const formData = new FormData();
		formData.append('file', file);

		const resp = await fetch(endpoint, { method: 'POST', body: formData });
		if (!resp.ok) throw new Error(`Upload failed: ${resp.status}`);

		const body = await resp.json().catch(() => null);
		const remoteUrl = body?.result?.url || null;

		if (!remoteUrl) throw new Error('Invalid response from upload API');

		return remoteUrl;
	} catch (err) {
		console.error('Upload failed', err);
		showToast({ type: 'error', description: 'Image upload failed.' });
		return null;
	}
}

export async function cropAndUploadImage({
	file,
	cropAreaPixels,
	uploadEndpoint = '/api/upload/image',
	maxSizeMB = 5
}: {
	file: File;
	cropAreaPixels: { x: number; y: number; width: number; height: number };
	uploadEndpoint?: string;
	maxSizeMB?: number;
}) {
	if (!file) {
		showToast({ type: 'error', description: 'No file selected.' });
		throw new Error('No file selected.');
	}
	if (!cropAreaPixels) {
		showToast({ type: 'error', description: 'Please adjust crop area before uploading.' });
		throw new Error('Missing crop area.');
	}

	if (file.size > maxSizeMB * 1024 * 1024) {
		showToast({ type: 'error', description: `File too large (max ${maxSizeMB} MB)` });
		throw new Error('File too large.');
	}

	const { formData, dataUrl } = await cropFileToFormData(file, cropAreaPixels, {
		mime: 'image/jpeg',
		quality: 0.9,
		devicePixelRatio: 1,
		maxWidth: 1024,
		autoFixOrientation: true,
		fileName: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
		formFieldName: 'file'
	});

	const resp = await fetch(uploadEndpoint, { method: 'POST', body: formData });

	if (!resp.ok) {
		const text = await resp.text().catch(() => 'Upload failed');
		throw new Error(text || `Upload failed (${resp.status})`);
	}

	const body = await resp.json().catch(() => null);
	const remoteUrl = body?.result?.url || body?.url || body?.data?.url || dataUrl;

	return remoteUrl;
}
