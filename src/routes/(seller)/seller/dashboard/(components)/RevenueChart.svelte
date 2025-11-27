<script lang="ts">
	import { formatDate, formatVND } from '$lib/utils/converters';
	import { Area, Axis, Chart, ChartClipPath, Highlight, Layer, Spline, Tooltip } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';

	const { chartData }: { chartData: { date: Date; revenue: number }[] } = $props();
</script>

<Chart
	data={chartData}
	x="date"
	y="revenue"
	yDomain={[0, null]}
	yNice
	padding={{ left: 24, bottom: 4 }}
	tooltip={{ mode: 'quadtree-x' }}
>
	<Layer type="svg">
		<Axis placement="left" format={(value) => formatVND(value)} grid rule />
		<Axis placement="bottom" format={(date) => formatDate(date)} rule tickSpacing={100} />

		<Spline draw={{ easing: cubicInOut, delay: 500 }} class="stroke-success-content stroke-2" />
		<ChartClipPath
			initialWidth={0}
			motion={{
				width: { type: 'tween', duration: 1000, easing: cubicInOut }
			}}
		>
			<Area class="fill-success/50" />
		</ChartClipPath>

		<Highlight points lines />
	</Layer>
	<Tooltip.Root>
		{#snippet children({ data })}
			<Tooltip.Header value={data.date} format={(date) => formatDate(date)} />
			<Tooltip.List>
				<Tooltip.Item
					label="Doanh thu"
					class="text-success-content"
					value={formatVND(data.revenue)}
				/>
			</Tooltip.List>
		{/snippet}
	</Tooltip.Root>
</Chart>
