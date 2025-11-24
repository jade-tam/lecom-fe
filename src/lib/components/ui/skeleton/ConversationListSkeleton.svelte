<h1 class="text-header3 mb-2 flex items-center gap-2 text-info-content">
	<span class="icon-[mingcute--message-4-fill]"></span>Trò chuyện và tin nhắn
</h1>

<div class="flex flex-col gap-2">
	{#each Array(3) as _, i}
		<div class="flex cursor-pointer justify-start gap-2 rounded-field border bg-base-200 p-2">
			<div class="h-16 w-16 shrink-0 skeleton rounded-full border"></div>
			<div class="flex grow flex-col gap-1">
				<div class="flex justify-between">
					<div class="flex items-center gap-1">
						<div class="h-4 w-20 skeleton"></div>
					</div>
					<div class="h-3 w-12 skeleton"></div>
				</div>
				<div class="h-3 w-24 skeleton"></div>
				<div class="h-3 w-32 skeleton"></div>
			</div>
			<div class="flex flex-col items-end justify-between"></div>
		</div>
	{/each}
</div>
