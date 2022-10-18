import React, { useContext } from "react";
import { algoliaClient } from "./algolia-client";
import { HotelIndex, SpaceIndex } from "./indices";

export type AlgoliaContext = {
  spaceIndex?: SpaceIndex;
  hotelIndex?: HotelIndex;
};

export type AlgoliaProviderProps = {
  children: React.ReactNode;
  appId: string;
  apiKey: string;
};

const AlgoliaContext = React.createContext<AlgoliaContext>({});

export function AlgoliaProvider({ apiKey, appId, children }: AlgoliaProviderProps) {
  const client = algoliaClient({ apiKey, appId });
  const spaceIndex = new SpaceIndex(client);
  const hotelIndex = new HotelIndex(client);
  return <AlgoliaContext.Provider value={{ spaceIndex, hotelIndex }}>{children}</AlgoliaContext.Provider>;
}

export function algoliaConsumer(render: (algolia: AlgoliaContext) => React.ReactNode) {
  return <AlgoliaContext.Consumer>{render}</AlgoliaContext.Consumer>;
}

export function useAlgolia(): AlgoliaContext {
  return useContext(AlgoliaContext);
}
