interface AlgoliaIndexConfig {
  space: string;
  hotel: string;
}

interface EnvironmentConfig {
  api: string;
  algoliaApiKey: string;
  algoliaAppId: string;
  algoliaIndex: AlgoliaIndexConfig;
}
interface AppConfig {
  mode: "dev" | "prod";
  dev: EnvironmentConfig;
  prod: EnvironmentConfig;
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
  },
  prod: {
    api: "https://api.pocketseq.com/prod/graphql",
    algoliaApiKey: "6c2c5bb09c6f0da1002a51d1995969bd",
    algoliaAppId: "K2PIS0458U",
    algoliaIndex: {
      space: "space_prod",
      hotel: "hotel_prod",
    },
  },
};
