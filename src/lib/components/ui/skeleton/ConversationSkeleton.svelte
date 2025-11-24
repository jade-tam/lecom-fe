<div class="flex h-full flex-col">
	<!-- Chat header skeleton -->
	<div class="flex items-center gap-2 rounded-t-field bg-base-100">
		<div class="h-12 w-12 skeleton rounded-full"></div>
		<div class="flex grow">
			<div class="flex flex-col justify-between gap-1">
				<div class="h-4 w-32 skeleton"></div>
				<div class="h-3 w-24 skeleton"></div>
			</div>
		</div>
		<div class="flex max-w-64 gap-2 rounded-field bg-primary/20 p-2">
			<div class="h-10 w-10 shrink-0 skeleton rounded-field"></div>
			<div class="flex flex-col justify-between gap-1">
				<div class="h-3 w-20 skeleton"></div>
				<div class="h-3 w-16 skeleton"></div>
			</div>
		</div>
	</div>

	<!-- Chat messages skeleton -->
	<div class="mt-2 flex-1 overflow-y-auto rounded-field border bg-secondary/10 p-4"></div>

	<!-- Chat input skeleton -->
	<div class="mt-2 bg-base-100">
		<div class="flex gap-2">
			<div class="h-10 w-full skeleton rounded"></div>
			<div class="h-10 w-20 skeleton rounded"></div>
		</div>
	</div>
</div>
