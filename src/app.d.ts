// See https://svelte.dev/docs/kit/types#app.d.ts

import type { LocalUser } from '$lib/types/User';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: LocalUser | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
