/** Envelope used by list endpoints. */
export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type Id = string;

/** Narrow a partial record to the keys the UI is allowed to send. */
export type Nullable<T> = { [K in keyof T]: T[K] | null };
