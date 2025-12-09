<script lang="ts">
	import AnimatedDiv from '$lib/components/animate/AnimatedDiv.svelte';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import { registerSchema, type RegisterSchema } from '$lib/schemas/registerSchema.js';
	import showToast, { type ToastData } from '$lib/utils/showToast.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<
		RegisterSchema,
		ToastData
	>(data.form, {
		validators: zod4Client(registerSchema)
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<main class="w-screen bg-base-200">
	<div class="mx-auto flex min-h-screen max-w-4xl items-center p-2">
		<!-- FORM ĐĂNG KÝ -->
		<AnimatedDiv animateVars={{ translateY: 16 }}>
			<form
				method="POST"
				class="h-fit w-full rounded-box border bg-base-100 p-4 md:p-8"
				use:enhance
			>
				<h1 class="">Tạo tài khoản mới.</h1>
				<p class="mb-6 text-sm">
					Đăng ký tài khoản mới để bắt đầu hành trình khám phá các sản phẩm, khóa học và kết nối với
					cộng đồng trên Lecom.
				</p>

				<div class="flex max-md:flex-col">
					<!-- TRÁI -->
					<div class="flex-1">
						<h2 class="">Thông tin cá nhân</h2>

						<FormInput
							name="fullName"
							label="Họ và tên"
							placeholder="Nhập họ và tên của bạn..."
							type="text"
							superForm={form}
							{errors}
						/>

						<FormInput
							name="dateOfBirth"
							label="Ngày sinh"
							placeholder="Nhập ngày sinh của bạn..."
							type="date"
							superForm={form}
							{errors}
						/>

						<FormInput
							name="phoneNumber"
							label="Số điện thoại"
							placeholder="Nhập số điện thoại của bạn..."
							type="tel"
							superForm={form}
							{errors}
						/>

						<FormInput
							name="address"
							label="Địa chỉ"
							placeholder="Nhập địa chỉ của bạn..."
							type="text"
							superForm={form}
							{errors}
						/>
					</div>

					<div class="divider divider-horizontal max-md:divider-vertical"></div>

					<!-- PHẢI -->
					<div class="flex-1">
						<h2 class="">Thông tin đăng nhập</h2>

						<FormInput
							name="userName"
							label="Tên đăng nhập"
							placeholder="Nhập tên đăng nhập..."
							type="text"
							superForm={form}
							{errors}
						/>

						<FormInput
							name="email"
							label="Email"
							placeholder="Nhập email của bạn..."
							type="text"
							superForm={form}
							{errors}
						/>

						<FormInput
							name="password"
							label="Mật khẩu"
							placeholder="Nhập mật khẩu bí mật..."
							type="password"
							superForm={form}
							{errors}
						/>

						<FormInput
							name="confirmPassword"
							label="Xác nhận mật khẩu"
							placeholder="Nhập lại mật khẩu bí mật..."
							type="password"
							superForm={form}
							{errors}
						/>
					</div>
				</div>

				<button class="btn mt-10 w-full btn-primary" disabled={$submitting}>
					Đăng ký tài khoản mới
					{#if $delayed}
						<span class="loading loading-md loading-dots"></span>
					{/if}
				</button>

				<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/login"
					>Đã có tài khoản? <strong>Đăng nhập ngay</strong>.</a
				>
			</form>
		</AnimatedDiv>
	</div>
</main>
