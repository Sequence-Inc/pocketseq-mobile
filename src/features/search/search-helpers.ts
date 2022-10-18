import { Region } from "react-native-maps";
import { SearchResponse } from "@algolia/client-search";
import {
  HotelBuildingType,
  SubscriptionCategoryType,
} from "../../services/domains";
import SearchCoordinator from "./search-coordinator";

export type ISearchScreenProps = {
  coordinator: SearchCoordinator;
} & SpaceSearchFilterOptions &
  HotelSearchFilterOptions;

export type ISearchScreenParams = SpaceSearchFilterOptions &
  HotelSearchFilterOptions;

export type SearchType = "SPACE" | "HOTEL";

export type SpaceSearchFilterOptions = {
  searchType?: SearchType;
  spaceType?: string;
  checkInDate?: string;
  city?: string;
  minPax?: number;
  maxPax?: number;
  price?: number;
  minPrice?: number;
  geoloc?: Region;
  boundingBox?: number[];
  subscriptionRank?: SubscriptionCategoryType;
};

export type HotelSearchFilterOptions = {
  searchType?: SearchType;
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adult?: number;
  child?: number;
  breakfast?: boolean;
  pet?: boolean;
  buildingType?: HotelBuildingType;
  geoloc?: Region;
  boundingBox?: number[];
  subscriptionRank?: SubscriptionCategoryType;
};

export type SearchResult = {
  id: string;
  name: string;
  maxAdult: number;
  maxChild?: number;
  price: number;
  priceUnit: string;
  lat: number;
  lng: number;
  thumbnail: string;
  prefecture: string;
  city: string;
  type: SearchType;
};

export const mapSpaceSearchResponseToSpaceObject = (
  type: "HOTEL" | "SPACE",
  results: SearchResponse<any>,
  searchParams?: SpaceSearchFilterOptions & HotelSearchFilterOptions
): { data: SearchResult[]; hits: number } => {
  if (results.hits.length === 0) {
    return { data: [], hits: 0 };
  }
  const mappedResult = results.hits.map((result: any) => {
    if (type === "SPACE") {
      let max = 9999999999;
      let min = 0;
      let spaceType = "HOURLY";
      let duration = 1;

      if (searchParams?.minPrice) {
        min = searchParams.minPrice - 1;
      }

      result.price.map((price: any) => {
        if (max > price.amount && price.amount >= min) {
          max = price.amount;
          spaceType = price.type;
          duration = price.duration;
        }
      });

      let priceUnit = "";

      if (spaceType === "DAILY") {
        priceUnit = "日";
      } else if (spaceType === "HOURLY") {
        priceUnit = "時間";
      } else {
        priceUnit = "分";
      }

      if (duration > 1) {
        priceUnit = duration + priceUnit;
      }

      return {
        id: result.objectID,
        name: result.name,
        maxAdult: result.maximumCapacity,
        maxChild: 0,
        price: max,
        priceUnit,
        lat: result._geoloc?.lat,
        lng: result._geoloc?.lng,
        thumbnail: result.thumbnail,
        prefecture: result.prefecture,
        city: result.city,
        type,
      };
    } else {
      return {
        id: result.objectID,
        name: result.name,
        maxAdult: result.maxAdult,
        maxChild: result.maxChild,
        price: result.lowestPrice,
        priceUnit: "泊",
        lat: result._geoloc?.lat,
        lng: result._geoloc?.lng,
        thumbnail: result.thumbnail,
        prefecture: result.prefecture,
        city: result.city,
        type,
      };
    }
  });

  return { data: mappedResult, hits: results.nbHits };
};
