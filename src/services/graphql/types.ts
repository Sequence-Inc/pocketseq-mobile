import { FetchResult, MutationResult, QueryResult } from "@apollo/client";

export type MutationHook<Result, Input> = () => MutationTuple<Result, Input>;

export type MutationTuple<Result, Input> = [(input: Input) => Promise<FetchResult<Result>>, MutationResult<Result>];

export type QueryHook<Result, Variables, Lazy extends Boolean = false> = () => Lazy extends true
  ? QueryTuple<Result, Variables>
  : QueryResult<Result, Variables>;

export type QueryTuple<Result, Variables> = [
  (vars: Variables) => Promise<QueryResult<Result, Variables>>,
  QueryResult<Result, Variables>
];
