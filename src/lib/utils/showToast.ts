import Toast from '$lib/components/ui/Toast.svelte';
import { toast } from 'svelte-sonner';

type ToastType = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ToastData = {
	type?: ToastType;
	title?: string | null;
	description?: string;
};

export default function showToast(toastData: ToastData) {
	toast.custom(Toast, {
		componentProps: toastData
	});
}
