import { SortDirection } from "mongodb";

export type ParsePaginateAndQueryProp = {
  page?: number | any;
  perPage?: number;
  q?: string | any;
  sort_by?: string;
  sort?: SortDirection;
};

export const parsePaginateAndQuery = ({
  page,
  perPage,
  q,
  sort_by,
  sort,
}: ParsePaginateAndQueryProp) => {
  if (!perPage) {
    perPage = 10;
  }

  if (!page) {
    page = 1;
  }

  const skip = (page - 1) * perPage;
  const limit = perPage;

  return {
    skip,
    limit,
    query: q,
    sort_by: sort_by,
    sort: sort,
  };
};
