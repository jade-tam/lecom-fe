<script lang="ts">
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
		<!-- HERE IS THE FORM -->
		<form method="POST" class="h-fit w-full rounded-box border bg-base-100 p-4 md:p-8" use:enhance>
			<p class="text-header1 mb-2">Your Journey Begin Here</p>
			<h1 class="text-header2 mb-8 text-right font-bold">Let's create a new account.</h1>

			<div class="flex max-md:flex-col">
				<!-- LEFT -->
				<div class="flex-1">
					<h2 class="">Personal Information</h2>

					<FormInput
						name="fullname"
						label="Fullname"
						placeholder="Enter your full name..."
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="dateOfBirth"
						label="Date Of Birth"
						placeholder="Enter your date of birth..."
						type="date"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="phoneNumber"
						label="Phone Number"
						placeholder="Enter your phone number..."
						type="tel"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="address"
						label="Address"
						placeholder="Enter your address..."
						type="text"
						superForm={form}
						{errors}
					/>
				</div>

				<div class="divider divider-horizontal max-md:divider-vertical"></div>

				<!-- RIGHT -->
				<div class="flex-1">
					<h2 class="">Login Details</h2>

					<FormInput
						name="username"
						label="Username"
						placeholder="Enter your username..."
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="email"
						label="Email"
						placeholder="Enter your email..."
						type="text"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="password"
						label="Password"
						placeholder="Your super secret password..."
						type="password"
						superForm={form}
						{errors}
					/>

					<FormInput
						name="confirmPassword"
						label="Confirm Password"
						placeholder="Your super secret password... again"
						type="password"
						superForm={form}
						{errors}
					/>
				</div>
			</div>

			<button class="btn mt-10 w-full btn-primary" disabled={$submitting}>
				Register new account
				{#if $delayed}
					<span class="loading loading-md loading-dots"></span>
				{/if}
			</button>

			<a class="btn mt-6 w-full btn-ghost btn-sm" href="/auth/login"
				>Already have an account? <strong>Log in now</strong>.</a
			>
		</form>
	</div>
</main>
