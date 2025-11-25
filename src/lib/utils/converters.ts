import type { Voucher } from '$lib/types/Voucher';

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

export function formatVND(amount: number): string {
	return amount
		.toLocaleString('vi-VN', {
			style: 'currency',
			currency: 'VND',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		})
		.replace('₫', 'đ'); // optional: lowercase for style consistency
}

export function toRomanNumeral(num: number): string {
	if (num <= 0) return '';
	const romanMap: [number, string][] = [
		[1000, 'M'],
		[900, 'CM'],
		[500, 'D'],
		[400, 'CD'],
		[100, 'C'],
		[90, 'XC'],
		[50, 'L'],
		[40, 'XL'],
		[10, 'X'],
		[9, 'IX'],
		[5, 'V'],
		[4, 'IV'],
		[1, 'I']
	];

	let result = '';
	for (const [value, symbol] of romanMap) {
		while (num >= value) {
			result += symbol;
			num -= value;
		}
	}
	return result;
}

export function toNumericString(num: number): string {
	return String(num);
}

export function toOrdinalNumber(num: number): string {
	const suffixes = ['th', 'st', 'nd', 'rd'];
	const v = num % 100;
	return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

export function formatVideoDuration(totalSeconds: number | undefined | null): string {
	if (!totalSeconds || totalSeconds < 0 || !isFinite(totalSeconds)) return '0:00';

	const seconds = Math.floor(totalSeconds % 60);
	const minutes = Math.floor((totalSeconds / 60) % 60);
	const hours = Math.floor(totalSeconds / 3600);

	const pad = (n: number) => n.toString().padStart(2, '0');

	if (hours > 0) {
		// ✅ Always show H:MM:SS
		return `${hours}:${pad(minutes)}:${pad(seconds)}`;
	}

	// ✅ Always show M:SS (even for less than 1 minute)
	return `${minutes}:${pad(seconds)}`;
}

export function formatChatTime(input: string | Date): string {
	const date = input instanceof Date ? input : parseUtcToLocal(input);
	if (isNaN(date.getTime())) return '';

	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);

	if (diffSec < 5) return 'Vừa xong';
	if (diffMin < 1) return `${diffSec} giây trước`;
	if (diffMin < 60) return `${diffMin} phút trước`;
	if (diffHour < 24) return `${diffHour} giờ trước`;

	if (diffDay < 7) return `${diffDay} ngày trước`;

	// Yesterday
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);
	if (
		date.getDate() === yesterday.getDate() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getFullYear() === yesterday.getFullYear()
	) {
		return 'Hôm qua';
	}

	// Same year: show day-month
	if (date.getFullYear() === now.getFullYear()) {
		return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}`;
	}

	// Different year: show full date
	return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}-${date.getFullYear()}`;
}

export function parseUtcToLocal(dateStr: string): Date {
	// If no timezone info, treat as UTC
	if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateStr) && !dateStr.endsWith('Z')) {
		return new Date(dateStr + 'Z');
	}
	return new Date(dateStr);
}

export function toDateInputValue(str: string) {
	if (!str) return '';
	const date = new Date(str);
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getVoucherTitle(voucher: Voucher) {
	if (!voucher) return '';
	const typeTitle = voucher.discountType === 'Percentage' ? 'Giảm ' : 'Giảm ';
	const discountValue =
		voucher.discountType === 'Percentage'
			? `${voucher.discountValue}%`
			: `${voucher.discountValue.toLocaleString()}₫`;
	const minOrder = voucher.minOrderAmount
		? `Đơn tối thiểu ${voucher.minOrderAmount.toLocaleString()}₫`
		: '';
	const maxDiscount =
		voucher.maxDiscountAmount && voucher.discountType === 'Percentage'
			? `, giảm tối đa ${voucher.maxDiscountAmount.toLocaleString()}₫`
			: '';
	return `${voucher.code} - ${typeTitle} ${discountValue}${maxDiscount}${minOrder ? ' | ' + minOrder : ''}`;
}
