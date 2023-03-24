import { getPreferenceValues } from "@raycast/api";
import axios from "axios";
import { Preferences } from "./types";

const { HABITICA_USER_ID, HABITICA_API_KEY } = getPreferenceValues<Preferences>();

const habiticaClient = axios.create({
  baseURL: "https://habitica.com",
  headers: {
    Accept: "application/json",
    "x-api-user": HABITICA_USER_ID,
    "x-api-key": HABITICA_API_KEY,
    "x-client": HABITICA_USER_ID + "-raycast",
  },
});

type CreateTaskArgs = {
  text: string;
  type: "todo";
};
export function createTask({ text, type }: CreateTaskArgs) {
  return habiticaClient.post("/api/v3/tasks/user", {
    text,
    type,
  });
}
