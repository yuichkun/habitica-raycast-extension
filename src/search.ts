import Fuse from "fuse.js";
import { HabiticaDaily, HabiticaTask, Tag } from "./types";

export function searchItems<T extends HabiticaTask | HabiticaDaily>(
  unfilteredItems: T[],
  allTags: Tag[] | undefined,
  searchText: string
) {
  type SearchTarget = Omit<T, "tags"> & { tags: Tag[]; completed?: string };
  const searchTargets: SearchTarget[] = unfilteredItems.map((task) => {
    const tags = task.tags.map((tagId) => {
      const found = allTags?.find((tag) => tag.id === tagId);
      if (!found) throw new Error(`${tagId} is not a valid tag`);
      return found;
    });

    function getCompleted() {
      if ("completed" in task) {
        return task.completed ? "Done" : "Incomplete";
      }
    }

    return {
      ...task,
      tags,
      completed: getCompleted(),
    };
  });
  const fuse = new Fuse(searchTargets, {
    keys: ["text", "tags.name", "completed"],
    threshold: 0.4,
  });
  const result = fuse.search(searchText);
  const matchingItemIds = result.map((r) => r.item.id);
  return unfilteredItems.filter((item) => matchingItemIds.includes(item.id));
}
