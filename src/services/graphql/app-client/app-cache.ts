import { InMemoryCache } from "@apollo/client";
import { persistCacheSync } from "apollo3-cache-persist";
import { ApolloPersistOptions } from "apollo3-cache-persist/lib/types";

export type AppCacheConstructorArgs = {
  storage?: AppStorage;
};

export type AppStorage = ApolloPersistOptions<CacheShape>["storage"];

export type CacheShape = any;

export default class AppCache extends InMemoryCache {
  storage?: AppStorage;
  constructor({ storage }: AppCacheConstructorArgs = {}) {
    super({
      typePolicies: {},
    });
    this.storage = storage;
    if (storage) persistCacheSync({ cache: this, storage });
  }
}
