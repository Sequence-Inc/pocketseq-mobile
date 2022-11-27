import { ADDRESS, Address } from "./address";
import { CancelPolicy, CANCEL_POLICY } from "./cancelPolicy";
import { HOST, Host } from "./host";
import { OPTION, Option } from "./option";
import { Photo, PHOTO } from "./photo";
import { RATING, Rating } from "./rating";
import { SpacePricePlan, SPACE_PRICE_PLAN } from "./spacePricePlan";
import { SpaceSetting, SPACE_SETTING } from "./spaceSetting";
import { SpaceType, SPACE_TYPE } from "./spaceType";
import { NearestStation, NEAREST_STATION } from "./station";
import { SUBSCRIPTION, Subscription } from "./subscription";

export type FilterPaxGroup = {
  type: string;
  name: string;
  min: number | null;
  max: number | null;
};

export const filterPaxGroup: FilterPaxGroup[] = [
  {
    type: "NONE",
    name: "指定なし",
    min: null,
    max: null,
  },
  {
    type: "1:10",
    name: "1〜10名",
    min: 1,
    max: 10,
  },
  {
    type: "11:15",
    name: "11〜15名",
    min: 11,
    max: 15,
  },
  {
    type: "16:20",
    name: "16〜20名",
    min: 16,
    max: 20,
  },
  {
    type: "21:25",
    name: "21〜25名",
    min: 21,
    max: 25,
  },
  {
    type: "26:30",
    name: "26〜30名",
    min: 26,
    max: 30,
  },
  {
    type: "31:35",
    name: "31〜35名",
    min: 31,
    max: 35,
  },
  {
    type: "36:40",
    name: "36〜40名",
    min: 36,
    max: 40,
  },
  {
    type: "40:1000",
    name: "40名以上",
    min: 40,
    max: 1000,
  },
];

export const filterPaxGroupMap: { [key: string]: string } = {
  NONE: "指定なし",
  "1:10": "1〜10名",
  "11:15": "11〜15名",
  "16:20": "16〜20名",
  "21:25": "21〜25名",
  "26:30": "26〜30名",
  "31:35": "31〜35名",
  "36:40": "36〜40名",
  "40:1000": "40名以上",
};

export interface SpaceAmenities {
  id: string;
  name: string;
}
export const SPACE_AMENITIES = `
  id
  name
`;

export interface ReservedDate {
  fromDateTime: number;
  toDateTime: number;
}

export const RESERVED_DATE = `
  fromDateTime:
  toDateTime
`;

export const SPACE = `
  id
  description
  name
  maximumCapacity
  numberOfSeats
  spaceSize
  needApproval
  published
  subcriptionPrice
  nearestStations {
    ${NEAREST_STATION}
  }
  spaceTypes {
    ${SPACE_TYPE}
  }
  address {
    ${ADDRESS}
  }
  photos {
    ${PHOTO}
  }
  host {
    ${HOST}
  }
  availableAmenities {
    ${SPACE_AMENITIES}
  }
  pricePlans {
    ${SPACE_PRICE_PLAN}
  }
  settings {
    ${SPACE_SETTING}
  }
  reservedDates {
    ${RESERVED_DATE}
  }
  ratings {
    ${RATING}
  }
  includedOptions {
    ${OPTION}
  }
  additionalOptions {
    ${OPTION}
  }
  cancelPolicy {
    ${CANCEL_POLICY}
  }
`;

// subscriptionProducts {
//   ${SUBSCRIPTION}
// }
export const SPACE_EXCERPT = `
  id
  description
  name
`;

export interface SpaceExcerpt {
  id: string;
  description: string;
  name: string;
}

export interface Space {
  id: string;
  description: string;
  name: string;
  maximumCapacity: number;
  numberOfSeats: number;
  spaceSize: number;
  needApproval: boolean;
  published: boolean;
  subcriptionPrice: number;
  nearestStations: NearestStation[];
  spaceTypes: SpaceType[];
  address: Address;
  photos: Photo[];
  host: Host;
  availableAmenities: SpaceAmenities[];
  pricePlans: SpacePricePlan[];
  settings: SpaceSetting[];
  reservedDates: ReservedDate[];
  ratings: Rating[];
  includedOptions: Option[];
  additionalOptions: Option[];
  cancelPolicy: CancelPolicy;
  subscriptionProducts: Subscription[];
}
