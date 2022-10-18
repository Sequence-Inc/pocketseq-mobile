import algoliasearch, { SearchClient } from "algoliasearch";

export type AlgoliaClient = SearchClient;

export type AlgoliaClientArgs = { apiKey: string; appId: string };

export function algoliaClient({ apiKey, appId }: AlgoliaClientArgs): SearchClient {
  return algoliasearch(appId, apiKey);
}
