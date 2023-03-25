import moment from "moment";

// date.ts
export enum Priority {
  High,
  Medium,
  Low,
  Default,
}

export function determineColor(date: string): Priority {
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
