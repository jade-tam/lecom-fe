
export function toPascalCase(segment: string) {
	return segment
		.split('-') // split by dash
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1)) // cap first letter
		.join(' ');
}

export function formatDate(input: string | Date): string {
	try {
		const date = input instanceof Date ? input : new Date(input);

		if (isNaN(date.getTime())) {
			throw new Error('Invalid date input');
		}

		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	} catch (error) {
		console.error('Date formatting error:', error);
		return '';
	}
}

export function getTimeSince(dateInput: string | Date): string {
	const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
	if (isNaN(date.getTime())) return '';

	const now = new Date();

	let years = now.getFullYear() - date.getFullYear();
	let months = now.getMonth() - date.getMonth();
	let days = now.getDate() - date.getDate();

	// Adjust days and months if negative
	if (days < 0) {
		// Borrow days from previous month
		const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
		days += prevMonth.getDate();
		months--;
	}

	if (months < 0) {
		years--;
		months += 12;
	}

	// 🧠 If less than 1 year → show months + days
	if (years < 1) {
		const parts: string[] = [];
		if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
		if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
		if (parts.length === 0) return '0 day';
		return parts.join(' ');
	}

	// 🧠 If 1 year or more → show years + months
	const parts: string[] = [];
	if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
	if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
	return parts.join(' ');
}
