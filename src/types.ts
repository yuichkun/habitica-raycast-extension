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
  id: string;
  text: string;
  date: string | null;
  tags: string[];
};

export type GetTagResponse = {
  success: boolean;
  data: {
    name: string;
    id: string;
  };
};
