import moment from "moment";
import { HabiticaTask } from "./types";

// date.ts
export enum Priority {
  High,
  Medium,
  Low,
  Default,
}

export function determinePriority(date: string): Priority {
  const now = moment.utc().startOf("day");
  const targetDate = moment.utc(date).startOf("day");

  if (targetDate.isBefore(now)) {
    return Priority.High;
  }

  const daysDifference = targetDate.diff(now, "days");

  if (daysDifference === 0) {
    return Priority.Medium;
  } else if (daysDifference === 1) {
    return Priority.Low;
  }

  return Priority.Default;
}

export function sortByDate(a: HabiticaTask, b: HabiticaTask) {
  if (a.date && b.date) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  } else if (a.date) {
    return -1;
  } else if (b.date) {
    return 1;
  } else {
    return 0;
  }
}
