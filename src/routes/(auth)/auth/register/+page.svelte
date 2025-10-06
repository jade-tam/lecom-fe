<script lang="ts">
	import { registerSchema } from '$lib/schemas/registerSchema.js';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';

	const { data } = $props();
	const { form, errors, message, enhance, submitting, delayed } = superForm(data.form, {
		validators: zod4Client(registerSchema)
	});
</script>

<main class="w-screen bg-base-200">
	<div class="mx-auto flex min-h-screen max-w-md items-center p-2">
		<!-- HERE IS THE FORM -->
		<form method="POST" class="h-fit w-full rounded-box bg-base-100 p-4 md:p-8" use:enhance>
			<h1 class="mb-4 font-serif text-3xl">Your Journey Begin Here</h1>
			<h1 class="mb-6 text-right font-serif text-xl">Let's make an account.</h1>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Email</legend>
				<label class="input w-full">
					<span class="icon-[fa7-solid--envelope] text-secondary"></span>
					<input
						type="text"
						name="email"
						bind:value={$form.email}
						placeholder="Type in your niche email..."
					/>
				</label>
				{#if $errors.email}<p class="label text-error">{$errors.email}</p>{/if}
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Password</legend>
				<label class="input w-full">
					<span class="icon-[fa7-solid--star-of-life] text-secondary"></span>
					<input
						type="password"
						name="password"
						bind:value={$form.password}
						placeholder="Your super secret password..."
					/>
				</label>
				{#if $errors.password}<p class="label text-error">{$errors.password}</p>{/if}
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Confirm Password</legend>
				<label class="input w-full">
					<span class="icon-[fa7-solid--star-of-life] text-secondary"></span>
					<input
						type="confirmPassword"
						name="confirmPassword"
						bind:value={$form.confirmPassword}
						placeholder="Your super secret password... again"
					/>
				</label>
				{#if $errors.confirmPassword}<p class="label text-error">{$errors.confirmPassword}</p>{/if}
			</fieldset>

			{#if $message}
				<div
					role="alert"
					class="mt-6 alert"
					class:alert-error={$message?.type === 'error'}
					class:alert-success={$message?.type === 'success'}
				>
					{#if $message?.type === 'success'}
						<span class="text-2xl icon-[pixelarticons--mail-arrow-right]"></span>
					{/if}
					{#if $message?.type === 'error'}
						<span class="text-2xl icon-[pixelarticons--alert]"></span>
					{/if}
					<span>{$message.text}</span>
				</div>
			{/if}

			<button class="btn mt-10 w-full btn-primary" disabled={$submitting}
				>Register new account
				{#if $delayed}
					<span class="loading loading-md loading-dots"></span>
				{/if}
			</button>

			<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/login"
				>Already have an account? Log in now.</a
			>
		</form>
	</div>
</main>
