// import { Platform } from "react-native";

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
