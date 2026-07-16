interface PaginationQuery {
  page?: string;
  limit?: string;
}

interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function normalizePagination(query: PaginationQuery): PaginationResult {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}
