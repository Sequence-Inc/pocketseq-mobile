import { SearchIndex } from "algoliasearch";
import {
  HotelSearchFilterOptions,
  mapSpaceSearchResponseToSpaceObject,
} from "../../../features/search/search-helpers";
import { CONFIG } from "../../../utils/config";
import { AlgoliaClient } from "../algolia-client";

const hitsPerPage = 40;

export class HotelIndex {
  private index: SearchIndex;
  constructor(client: AlgoliaClient) {
    this.index = client.initIndex(CONFIG[CONFIG.mode].algoliaIndex.hotel);
  }
  async search(text: string = "", filter?: HotelSearchFilterOptions) {
    if (!filter) {
      const response = await this.index.search(text);
      return mapSpaceSearchResponseToSpaceObject("SPACE", response, {
        minPrice: 0,
        price: 500000,
      });
    }

    const {
      boundingBox,
      city,
      adult,
      child,
      breakfast,
      pet,
      buildingType,
      subscriptionRank,
    } = filter;

    let searchFilters: string = "";

    if (city)
      searchFilters =
        searchFilters === ""
          ? `city:${city}`
          : `${searchFilters} AND city:${city}`;

    if (breakfast)
      searchFilters =
        searchFilters === ""
          ? `isBreakfastIncluded:${breakfast}`
          : `${searchFilters} AND isBreakfastIncluded:${breakfast}`;

    if (pet)
      searchFilters =
        searchFilters === ""
          ? `isPetAllowed:${pet}`
          : `${searchFilters} AND isPetAllowed:${pet}`;

    if (buildingType)
      searchFilters =
        searchFilters === ""
          ? `buildingType:${buildingType}`
          : `${searchFilters} AND buildingType:${buildingType}`;

    if (adult)
      searchFilters =
        searchFilters === ""
          ? `maxAdult >= ${adult}`
          : `${searchFilters} AND maxAdult >= ${adult}`;

    if (child)
      searchFilters =
        searchFilters === ""
          ? `maxChild >= ${child}`
          : `${searchFilters} AND maxChild >= ${child}`;

    if (subscriptionRank) {
      let max = "";
      if (subscriptionRank === "A") {
        max = "<7001";
      } else if (subscriptionRank === "B") {
        max = "<10001";
      } else {
        max = ">10000";
      }
      searchFilters =
        searchFilters === ""
          ? `subcriptionPrice${max}`
          : `${searchFilters} AND subcriptinoPrice${max}`;
    }

    if (boundingBox) {
      const response = await this.index.search(text, {
        filters: searchFilters,
        insideBoundingBox: [boundingBox],
        hitsPerPage,
      });
      return mapSpaceSearchResponseToSpaceObject("HOTEL", response, filter);
    } else {
      const response = await this.index.search(text, {
        filters: searchFilters,
        hitsPerPage,
      });
      return mapSpaceSearchResponseToSpaceObject("HOTEL", response, filter);
    }
  }
}
