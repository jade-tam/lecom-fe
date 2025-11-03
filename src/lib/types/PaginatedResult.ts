export type PaginatedResult<T> = {
	totalItems: number;
	page: number;
	pageSize: number;
	totalPages: number;
	items: T[];
};
