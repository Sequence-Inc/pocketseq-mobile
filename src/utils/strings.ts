import moment from "moment";
import { ReservationStatus } from "../services/domains";

export const currencyFormatter = (amount: number): string => {
  return `￥${numberWithCommas(amount)}`;
  // if (Platform.OS === "ios") {
  //   const formatter = new Intl.NumberFormat("ja-JP", {
  //     style: "currency",
  //     currency: "JPY",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   });
  //   return formatter.format(amount);
  // } else {
  //   return `￥${numberWithCommas(amount)}`;
  // }
};

export const numberWithCommas = (x: number): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const hoursAsCancelPolicyDuration = (hours: number): string => {
  const duration = moment.duration(hours, "hours");
  if (hours < 72) {
    return `${duration.asHours()}時間前`;
  }
  const days = duration.asDays();
  const remainingHours = days % 1;
  if (remainingHours === 0) {
    return `${Math.floor(days)}日前`;
  }
  return `${Math.floor(days)}日${Math.floor(
    moment.duration(remainingHours, "day").asHours()
  )}時間前`;
};

export const reservationStatusJapanify = (key: ReservationStatus): string => {
  const map: Record<ReservationStatus, string> = {
    RESERVED: "予約済み",
    CANCELED: "キャンセル",
    HOLD: "ホールド",
    PENDING: "ペンディング",
    FAILED: "失敗した",
    DISAPPROVED: "不承認",
  };
  return map[key] || key;
};
