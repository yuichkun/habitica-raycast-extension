import { getPreferenceValues } from "@raycast/api";
import axios from "axios";
import { HabiticaTask, HabiticaTaskTypes, Preferences } from "./types";

// yuichkun's habitica's ID
const AUTHOR_ID = "f9b0f250-35a4-498c-ae5b-3aa48bf167e7";
const { HABITICA_USER_ID, HABITICA_API_KEY } = getPreferenceValues<Preferences>();

const habiticaClient = axios.create({
  baseURL: "https://habitica.com",
  headers: {
    Accept: "application/json",
    "x-api-user": HABITICA_USER_ID,
    "x-api-key": HABITICA_API_KEY,
    "x-client": AUTHOR_ID + "-raycast",
  },
});

type CreateTaskArgs = {
  text: string;
  type: HabiticaTaskTypes;
  date?: string;
};
export function createTask({ text, type, date }: CreateTaskArgs) {
  return habiticaClient.post("/api/v3/tasks/user", {
    text,
    type,
    date,
  });
}

export async function retrieveTasks() {
  const res = await habiticaClient.get<{
    data: HabiticaTask[];
  }>("/api/v3/tasks/user?type=todos");
  return res.data.data;
}

export async function completeTask(taskId: string) {
  await habiticaClient.post(`/api/v3/tasks/${taskId}/score/up`);
}

export async function updateDueDate(taskId: string, date: Date | null) {
  await habiticaClient.put(`/api/v3/tasks/${taskId}`, {
    date: date,
  });
}
