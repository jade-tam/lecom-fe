<script lang="ts">
	import WithdrawalDetail from '$lib/components/layout/WithdrawalDetail.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';

	const { data } = $props();

</script>

{#await data.withdrawalPromise}
	<LoadingPlaceholder text="Đang tải chi tiết yêu cầu rút tiền..." />
{:then withdrawal}
	{#if withdrawal}
		<WithdrawalDetail {withdrawal} isCustomer />
	{:else}
		<EmptyPlaceholder text="Yêu cầu rút tiền không tồn tại hoặc đã bị xóa." />
	{/if}
{/await}
