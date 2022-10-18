export interface Station {
  id: number;
  stationName: string;
  stationZipCode: string;
  address: string;
  longitude: number;
  latitude: number;
  prefectureCode: number;
}

export const STATION = `
  id
  stationName
  stationZipCode
  address
  longitude
  latitude
  prefectureCode
`;

export interface NearestStation {
  station: Station;
  time: number;
  via: string;
}

export const NEAREST_STATION = `
  station {
    ${STATION}
  }
  time
  via
`;

export interface HotelNearestStation {
  station: Station;
  time: number;
  accessType: string;
}

export const HOTEL_NEAREST_STATION = `
  station {
    ${STATION}
  }
  time
  accessType
`;
