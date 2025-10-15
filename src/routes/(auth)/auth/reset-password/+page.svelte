<script lang="ts">
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/ui/FormInput.svelte';
	import {
		resetPasswordSchema,
		type ResetPasswordSchema
	} from '$lib/schemas/resetPasswordSchema.js';
	import showToast, { type ToastData } from '$lib/utils/showToast';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm<
		ResetPasswordSchema,
		ToastData
	>(data.form, {
		validators: zod4Client(resetPasswordSchema),
		onUpdated: ({ form }) => {
			if (form.message?.type === 'success') {
				goto('/auth/login');
			}
		}
	});

	$effect(() => {
		if ($message) {
			showToast($message);
		}
	});
</script>

<main class="w-screen bg-base-200">
	<div class="mx-auto flex min-h-screen max-w-md items-center p-2">
		<!-- HERE IS THE FORM -->
		<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 md:p-8" use:enhance>
			<h1 class="mb-8 text-center font-serif text-3xl">Reset your password</h1>

			<FormInput
				name="email"
				label="Email"
				placeholder="Email of your account..."
				type="text"
				icon="icon-[fa7-solid--envelope]"
				readonly
				superForm={form}
				{errors}
			/>

			<FormInput hidden name="token" label="Token" readonly superForm={form} {errors} />

			<FormInput
				name="newPassword"
				label="New Password"
				placeholder="Your new super secret password..."
				type="password"
				icon="icon-[fa7-solid--star-of-life]"
				superForm={form}
				{errors}
			/>

			<FormInput
				name="confirmPassword"
				label="Confirm Password"
				placeholder="Your super secret password... again"
				type="password"
				icon="icon-[fa7-solid--star-of-life]"
				superForm={form}
				{errors}
			/>

			<button class="btn mt-2 w-full btn-primary" disabled={$submitting}
				>Confirm
				{#if $delayed}
					<span class="loading loading-md loading-dots"></span>
				{/if}
			</button>

			<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/register"
				>Suddenly remember your password?<strong>Back to login</strong>.</a
			>
		</form>
	</div>
</main>
