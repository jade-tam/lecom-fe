<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import { loginSchema, type LoginSchema } from '$lib/schemas/loginSchema.js';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<LoginSchema, ToastData>(
		data.form,
		{
			validators: zod4Client(loginSchema),
			onUpdated: ({ form }) => {
				if (form.message?.type === 'success') {
					goto('/learning');
				}
			}
		}
	);

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<main class="w-screen bg-base-200">
	<div class="mx-auto flex min-h-screen max-w-md items-center p-2">
		<!-- FORM ĐĂNG NHẬP -->
		<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 md:p-8" use:enhance>
			<h1 class="mb-4 text-center">Đăng nhập</h1>
			<p class="text-header2">Chào mừng trở lại!</p>
			<p class="mb-4 text-sm">Đăng nhập để tiếp tục cuộc hành trình của bạn.</p>

			<FormInput
				name="username"
				label="Tên đăng nhập"
				placeholder="Nhập tên đăng nhập của bạn..."
				type="text"
				icon="icon-[fa7-solid--circle-user]"
				superForm={form}
				{errors}
			/>

			<FormInput
				name="password"
				label="Mật khẩu"
				placeholder="Nhập mật khẩu bí mật..."
				type="password"
				icon="icon-[fa7-solid--star-of-life]"
				superForm={form}
				{errors}
			/>

			<a class="float-end py-2 pl-2 text-xs font-bold" href="/auth/forgot-password"
				>Quên mật khẩu?</a
			>

			<button class="btn mt-2 w-full btn-primary" disabled={$submitting}
				>Đăng nhập
				{#if $delayed}
					<span class="loading loading-md loading-dots"></span>
				{/if}
			</button>

			<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/register"
				>Bạn là người dùng mới? <strong>Đăng ký tài khoản</strong>.</a
			>
		</form>
	</div>
</main>
