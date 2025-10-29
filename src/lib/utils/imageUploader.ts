import showToast from '$lib/utils/showToast';

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
