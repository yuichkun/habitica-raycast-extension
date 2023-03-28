export interface Todo {
  title: string;
  type: HabiticaTaskTypes;
  date?: Date;
  tags: string[];
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

export type HabiticaDaily = {
  id: string;
  text: string;
  tags: string[];
  isDue: boolean;
  completed: boolean;
};

export type HabiticaItems = {
  tasks: HabiticaTask[];
  dailys: HabiticaDaily[];
};

export type GetTagResponse = {
  success: boolean;
  data: Tag;
};

export type Tag = {
  name: string;
  id: string;
};

export type GetAllTagsResponse = {
  success: boolean;
  data: Tag[];
};
