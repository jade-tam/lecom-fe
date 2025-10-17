export function toPascalCase(segment: string) {
	return segment
		.split('-') // split by dash
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1)) // cap first letter
		.join(' ');
}
