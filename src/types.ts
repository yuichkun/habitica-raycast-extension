export interface Todo {
  title: string;
  difficulty: string;
  type: HabiticaTaskTypes;
  date?: Date;
  tags: string[];
}

export type HabiticaTaskTypes = "habit" | "daily" | "todo" | "reward";

export enum HabiticaTaskDifficulty {
  Trivial = 0.1,
  Easy = 1,
  Medium = 1.5,
  Hard = 2,
}

export interface Preferences {
  HABITICA_USER_ID: string;
  HABITICA_API_KEY: string;
  language: string;
}

export type HabiticaTask = {
  id: string;
  text: string;
  date: string | null;
  tags: string[];
  type: "todo";
};

export type HabiticaDaily = {
  id: string;
  text: string;
  tags: string[];
  isDue: boolean;
  completed: boolean;
  type: "daily";
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
