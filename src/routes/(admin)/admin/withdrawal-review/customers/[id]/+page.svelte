<script lang="ts">
	import WithdrawalDetail from '$lib/components/layout/WithdrawalDetail.svelte';
	import AdminReviewWithdrawalModalContent from '$lib/components/modal/AdminReviewWithdrawalModalContent.svelte';
	import OpenModalButton from '$lib/components/modal/OpenModalButton.svelte';
	import EmptyPlaceholder from '$lib/components/ui/EmptyPlaceholder.svelte';
	import LoadingPlaceholder from '$lib/components/ui/skeleton/LoadingPlaceholder.svelte';

	const { data } = $props();
</script>

{#await data.withdrawalPromise}
	<LoadingPlaceholder text="Đang tải chi tiết yêu cầu rút tiền..." />
{:then withdrawal}
	{#if withdrawal}
		<WithdrawalDetail {withdrawal} isCustomer />
		{#if withdrawal.status === 'Pending'}
			<div>
				<p class="mt-4 text-sm text-primary-content">
					Yêu cầu rút tiền này đang chờ xét duyệt. Vui lòng xem xét kỹ thông tin trước khi
					phê duyệt hoặc từ chối yêu cầu.
				</p>
				<OpenModalButton
					ModalContentProps={{ withdrawal, reviewType: 'shop', dataForm: data.form }}
					ModalContent={AdminReviewWithdrawalModalContent}
					openButtonProps={{
						class: "btn mt-4 btn-primary"
					}}><span class="icon-[mingcute--clipboard-line]"></span>Xét duyệt yêu cầu rút tiền</OpenModalButton
				>
			</div>
		{/if}
	{:else}
		<EmptyPlaceholder text="Yêu cầu rút tiền không tồn tại hoặc đã bị xóa." />
	{/if}
{/await}
