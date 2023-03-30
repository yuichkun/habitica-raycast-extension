import axios from "axios";
import { getConfig } from "./config";
import { GetAllTagsResponse, HabiticaDaily, HabiticaItems, HabiticaTask, HabiticaTaskTypes } from "./types";

// yuichkun's habitica's ID
const AUTHOR_ID = "f9b0f250-35a4-498c-ae5b-3aa48bf167e7";
const { HABITICA_USER_ID, HABITICA_API_KEY } = getConfig();

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
  tags?: string[];
};
export function createTask({ text, type, date, tags }: CreateTaskArgs) {
  return habiticaClient.post("/api/v3/tasks/user", {
    text,
    type,
    date,
    tags,
  });
}

async function retrieveTasks() {
  const res = await habiticaClient.get<{
    data: HabiticaTask[];
  }>("/api/v3/tasks/user?type=todos");
  return res.data.data;
}

async function retrieveDailys() {
  const res = await habiticaClient.get<{
    data: HabiticaDaily[];
  }>("/api/v3/tasks/user?type=dailys");
  return res.data.data;
}

export async function retrieveAllItems(): Promise<HabiticaItems> {
  const [tasks, dailys] = await Promise.all([retrieveTasks(), retrieveDailys()]);
  return {
    tasks,
    dailys,
  };
}

export async function completeTask(taskId: string) {
  await habiticaClient.post(`/api/v3/tasks/${taskId}/score/up`);
}

export async function deleteTask(taskId: string) {
  await habiticaClient.delete(`/api/v3/tasks/${taskId}`);
}

export async function renameTask(taskId: string, text: string) {
  await habiticaClient.put(`/api/v3/tasks/${taskId}`, {
    text,
  });
}

export async function updateDueDate(taskId: string, date: Date | null) {
  await habiticaClient.put(`/api/v3/tasks/${taskId}`, {
    date: date,
  });
}

export async function getAllTags() {
  const res = await habiticaClient.get<GetAllTagsResponse>(`/api/v3/tags`);
  return res.data.data;
}

export async function updateTags(taskId: string, tags: string[]) {
  await habiticaClient.put(`/api/v3/tasks/${taskId}`, {
    tags,
  });
}
