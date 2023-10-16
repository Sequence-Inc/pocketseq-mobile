interface AlgoliaIndexConfig {
  space: string;
  hotel: string;
}

interface EnvironmentConfig {
  api: string;
  algoliaApiKey: string;
  algoliaAppId: string;
  algoliaIndex: AlgoliaIndexConfig;
  stripePublishableKey: string;
}
interface AppConfig {
  mode: "dev" | "prod" | "local";
  dev: EnvironmentConfig;
  prod: EnvironmentConfig;
  local: EnvironmentConfig;
}
export const CONFIG: AppConfig = {
  mode: "dev", // CHANGE ENVIRONMENT FROM HERE
  dev: {
    api: "https://dev-api.pocketseq.com/dev/graphql",
    algoliaApiKey: "6c2c5bb09c6f0da1002a51d1995969bd",
    algoliaAppId: "K2PIS0458U",
    algoliaIndex: {
      space: "space_dev",
      hotel: "hotel_dev",
    },
    stripePublishableKey:
      "pk_test_51Jp6lWJX7alBswvIQ1Goc4GS6jjNo7T4pfr7pRlJgyvumBc9sZh8mHODrYXJBmNivIrVSsqQZQNdr9WEzuLLWooo00hPNUgRIh",
  },
  prod: {
    api: "https://api.pocketseq.com/prod/graphql",
    algoliaApiKey: "6c2c5bb09c6f0da1002a51d1995969bd",
    algoliaAppId: "K2PIS0458U",
    algoliaIndex: {
      space: "space_prod",
      hotel: "hotel_prod",
    },
    stripePublishableKey:
      "pk_live_51Jp6lWJX7alBswvIB5l2hpfXOeosasXmLF72khvSOylfssJBSUQhKmGgawAutxhmuaio1B9v2bP1ozsak78qJC0600VMCTkBY5",
  },
  local: {
    api: "http://localhost:3001/dev/graphql",
    algoliaApiKey: "6c2c5bb09c6f0da1002a51d1995969bd",
    algoliaAppId: "K2PIS0458U",
    algoliaIndex: {
      space: "space_dev",
      hotel: "hotel_dev",
    },
    stripePublishableKey:
      "pk_test_51Jp6lWJX7alBswvIQ1Goc4GS6jjNo7T4pfr7pRlJgyvumBc9sZh8mHODrYXJBmNivIrVSsqQZQNdr9WEzuLLWooo00hPNUgRIh",
  },
};
