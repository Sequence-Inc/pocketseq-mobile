import { SearchIndex } from "algoliasearch";
import {
  mapSpaceSearchResponseToSpaceObject,
  SpaceSearchFilterOptions,
} from "../../../features/search/search-helpers";
import { AlgoliaClient } from "../algolia-client";

const hitsPerPage = 40;
export class SpaceIndex {
  private index: SearchIndex;
  constructor(client: AlgoliaClient) {
    this.index = client.initIndex("space_prod");
  }
  async search(text: string = "", filter?: SpaceSearchFilterOptions) {
    if (!filter) {
      const response = await this.index.search(text);
      return mapSpaceSearchResponseToSpaceObject("SPACE", response, {
        minPrice: 0,
        price: 500000,
      });
    }

    const {
      spaceType,
      boundingBox,
      city,
      maxPax,
      minPax,
      price,
      minPrice,
      subscriptionRank,
    } = filter;

    let searchFilters: string = "";

    if (spaceType)
      searchFilters =
        searchFilters === ""
          ? `spaceTypes:${spaceType}`
          : `${searchFilters} AND spaceTypes:${spaceType}`;

    if (city)
      searchFilters =
        searchFilters === ""
          ? `city:${city}`
          : `${searchFilters} AND city:${city}`;

    if (maxPax) {
      if (minPax && minPax > 0) {
        searchFilters =
          searchFilters === ""
            ? `maximumCapacity:${minPax} TO ${maxPax}`
            : `${searchFilters} AND maximumCapacity:${minPax} TO ${maxPax}`;
      } else {
        searchFilters =
          searchFilters === ""
            ? `maximumCapacity >= ${maxPax}`
            : `${searchFilters} AND maximumCapacity >=${maxPax}`;
      }
    }

    let maxPrice = 9999999999;
    if (price) {
      maxPrice = price;
    }
    if (minPrice) {
      searchFilters =
        searchFilters === ""
          ? `price.amount:${minPrice - 1} TO ${maxPrice}`
          : `${searchFilters} AND price.amount:${minPrice - 1} TO ${maxPrice}`;
    } else {
      searchFilters =
        searchFilters === ""
          ? `price.amount:0 TO ${maxPrice}`
          : `${searchFilters} AND price.amount:0 TO ${maxPrice}`;
    }

    if (subscriptionRank) {
      let max = "";
      if (subscriptionRank === "A") {
        max = "<301";
      } else if (subscriptionRank === "B") {
        max = "<501";
      } else {
        max = ">500";
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
      return mapSpaceSearchResponseToSpaceObject("SPACE", response, filter);
    } else {
      const response = await this.index.search(text, {
        filters: searchFilters,
        hitsPerPage,
      });
      return mapSpaceSearchResponseToSpaceObject("SPACE", response, filter);
    }
  }
}
