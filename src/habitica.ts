import axios from "axios";
import { getConfig } from "./config";
import { GetAllTagsResponse, HabiticaDaily, HabiticaItems, HabiticaTask, HabiticaTaskTypes, HabiticaTaskDifficulty } from "./types";
import { sortByDate } from "./date";

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
  difficulty: string;
  type: HabiticaTaskTypes;
  date?: string;
  tags?: string[];
};
export function createTask({ text, type, difficulty, date, tags }: CreateTaskArgs) {
  return habiticaClient.post("/api/v3/tasks/user", {
    text: text,
    priority: HabiticaTaskDifficulty[difficulty as keyof typeof HabiticaTaskDifficulty],
    type: type,
    date: date,
    tags: tags,
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

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SortTasksResponse = {
  success: boolean;
};
export async function sortTasks(tasks: HabiticaTask[]) {
  const withDueDate = (task: HabiticaTask) => {
    return Boolean(task.date);
  };
  const sortedTasks = tasks.filter(withDueDate).sort(sortByDate);
  console.log("Sort Target length", sortedTasks.length);
  let idx = 0;
  for (const task of sortedTasks) {
    idx++;
    console.log("[sort start] Task id:", idx);
    try {
      const res = await habiticaClient.post<SortTasksResponse>(`/api/v3/tasks/${task.id}/move/to/${idx}`);
      console.log("[sort end] Task id:", idx);
      if (res.status === 200 && res.data.success) {
        continue;
      } else {
        throw new Error(
          `something unexpected happened while processing ${task.id}. Response status: ${res.status}, data: ${res.data}`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      await sleep(5_000);
    }
  }
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
