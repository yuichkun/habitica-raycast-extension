import Fuse from "fuse.js";
import { getConfig } from "./config";
import { determinePriority, Priority } from "./date";
import { findTags } from "./tag";
import { HabiticaDaily, HabiticaTask, Tag } from "./types";

export function searchItems<T extends HabiticaTask | HabiticaDaily>(
  unfilteredItems: T[],
  allTags: Tag[],
  searchText: string
) {
  const { language } = getConfig();
  type SearchTarget = Omit<T, "tags" | "date"> & { tags: Tag[]; completed?: string; date?: string; priority?: string };
  const searchTargets: SearchTarget[] = unfilteredItems.map((task) => {
    const tags = findTags(task, allTags);

    function getCompleted() {
      if ("completed" in task) {
        return task.completed ? "Done" : "Incomplete";
      }
    }

    function getPriority() {
      if ("date" in task && task.date) {
        const p = determinePriority(task.date);
        if (p === Priority.High) {
          return "past";
        }
        if (p === Priority.Medium) {
          return "today";
        }
        if (p === Priority.Low) {
          return "tomorrow";
        }
      }
    }
    function getDate() {
      if ("date" in task && task.date) {
        return new Date(task.date).toLocaleDateString(language);
      }
    }

    return {
      ...task,
      hasNoTag: tags.length === 0 ? "no tag" : "",
      tags,
      completed: getCompleted(),
      priority: getPriority(),
      date: getDate(),
    };
  });
  const fuse = new Fuse(searchTargets, {
    keys: ["text", "tags.name", "completed", "date", "priority", "hasNoTag"],
    useExtendedSearch: true,
    threshold: 0.2,
  });
  const result = fuse.search(searchText);
  const matchingItemIds = result.map((r) => r.item.id);
  return unfilteredItems.filter((item) => matchingItemIds.includes(item.id));
}
