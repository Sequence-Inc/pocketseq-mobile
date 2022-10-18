import { ApolloProvider, useApolloClient } from "@apollo/client";
import React from "react";
import AppClient from "./app-client";

export type AppClientProviderProps<CacheShape> = {
  children: React.ReactNode;
  client: AppClient<CacheShape>;
};

export function AppClientProvider<CacheShape extends object = object>({
  children,
  client,
}: AppClientProviderProps<CacheShape>) {
  return <ApolloProvider client={client} children={children} />;
}

export function withAppClient<CacheShape extends object = object>(
  Component: React.ComponentType,
  client: AppClient<CacheShape>
) {
  return () => (
    <AppClientProvider client={client}>
      <Component />
    </AppClientProvider>
  );
}

export function useAppClient<CacheShape extends object = object>(
  override?: AppClient<CacheShape>
): AppClient<CacheShape> {
  return useApolloClient(override) as AppClient<CacheShape>;
}
