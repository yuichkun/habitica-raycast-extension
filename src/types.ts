export interface Todo {
  title: string;
  type: HabiticaTaskTypes;
  date?: Date;
}

export type HabiticaTaskTypes = "habit" | "daily" | "todo" | "reward";

export interface Preferences {
  HABITICA_USER_ID: string;
  HABITICA_API_KEY: string;
}

export type HabiticaTask = {
  text: string;
  date?: string;
};
