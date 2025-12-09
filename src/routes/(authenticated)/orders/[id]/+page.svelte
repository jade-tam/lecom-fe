<script lang="ts">
	import OrderDetail from '$lib/components/layout/OrderDetail.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import type { Order } from '$lib/types/Order.js';
	import showToast from '$lib/utils/showToast.js';

	const { data, form } = $props();
	const order: Order | null = $derived(data.order);

	$effect(() => {
		if (form?.toastData) {
			showToast(form.toastData);
		}
	});

	$inspect(order);
</script>

{#if order}
	<OrderDetail
		{order}
		refundFormData={data.refundFormData}
		cancelOrderFormData={data.cancelOrderFormData}
		createProductFeedbackFormData={data.createProductFeedbackFormData}
	/>
{:else}
	<EmptyPlaceholder
		icon="icon-[fa7-solid--box-open]"
		text="Không tìm thấy đơn hàng, Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
		description="Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
	/>
{/if}
