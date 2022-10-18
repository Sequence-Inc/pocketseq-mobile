import moment, { Moment } from "moment";

export const useReduceObject = (obj: any, filterKeys: string[]) => {
  return Object.entries(Object.fromEntries(filterKeys.map((key) => [key, obj[key]]))).reduce(
    (a, [k, v]) => (v ? ((a[k] = v), a) : a),
    {}
  );
};

type DurationType = "DAILY" | "HOURLY" | "MINUTES";

export const getStartDateTime = (start: Moment, durationType: DurationType, hour: number, minute: number) => {
  const startDay = moment(start).format("YYYY-MM-DD");

  if (durationType !== "DAILY") {
    return moment(startDay).startOf("day").add(hour, "hours").add(minute, "minutes");
  } else {
    return moment(startDay, "YYYY-MM-DD").startOf("day");
  }
};

export const getEndDateTime = (startDateTime: Moment, duration: any, durationType: any) => {
  const startDT = moment(startDateTime);
  if (durationType === "DAILY") {
    return startDT.add(duration, "d");
  } else if (durationType === "HOURLY") {
    return startDT.add(duration, "hour");
  } else if (durationType === "MINUTES") {
    return startDT.add(duration, "m");
  }
};
