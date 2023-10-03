import {
  ApolloClient,
  ApolloClientOptions,
  from,
  HttpLink,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getInitialData, KEYS, SessionStore, setKey } from "../../storage";
import { GraphQLError } from "graphql";

type AppClientCache<CacheShape> = ApolloClientOptions<CacheShape>["cache"];

export type AppClientConstructorArgs<CacheShape> = {
  cache: AppClientCache<CacheShape>;
  uri: AppClientURI;
};

export type AppClientURI = string;

export type GqlError = {
  code: string;
  message: string;
  action: string;
  info: {
    locations: GraphQLError["locations"];
    path: GraphQLError["path"];
    stacktrace: any;
  };
};

const newAuthLink = () => {
  return setContext(async (_, { headers }) => {
    const { accessToken } = await getInitialData();
    const token = accessToken ? JSON.parse(accessToken) : null;

    if (token)
      return { headers: { ...headers, authorization: `Bearer ${token}` } };
    return { headers };
  });
};

const newErrorLink = (uri: string) => {
  return onError(({ forward, operation, graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        console.log(error);
        const gqlError = error as unknown as GqlError;
        const { action, code, info, message } = gqlError;
        if (action === "logout") SessionStore.clearToken();
        if (action === "refresh-token") {
          const refreshToken = SessionStore.refreshToken;
          return new Observable((observer) => {
            (async () => {
              try {
                const response = await fetch(uri, {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    operationName: "RefreshToken",
                    query: `mutation RefreshToken($token:String!) { refreshToken(token:$token) }`,
                    variables: { token: `Bearer ${refreshToken}` },
                  }),
                });
                const responseJson = await response.json();
                const newAccessToken = responseJson.data.refreshToken;

                // save new access token
                await setKey(KEYS.ACCESS_TOKEN, newAccessToken);
                // Modify the operation context with a new token
                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                });
                // Retry the request, returning the new observable
                forward(operation).subscribe({
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                });
              } catch (error) {
                observer.error(error);
              }
            })();
          });
        }
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
    return;
  });
};

export default class AppClient<
  CacheShape = object
> extends ApolloClient<CacheShape> {
  constructor({ cache, uri }: AppClientConstructorArgs<CacheShape>) {
    const httpLink = new HttpLink({ uri });
    const authLink = newAuthLink();
    const errorLink = newErrorLink(uri);

    super({ cache, link: from([errorLink, authLink, httpLink]) });
  }
}
