import Fuse from "fuse.js";
import { HabiticaTask, Tag } from "./types";

export function searchTasks(unfilteredTasks: HabiticaTask[], allTags: Tag[] | undefined, searchText: string) {
  const searchTargets = unfilteredTasks.map((task) => {
    return {
      ...task,
      tags: task.tags.map((tagId) => {
        const found = allTags?.find((tag) => tag.id === tagId);
        if (!found) throw new Error(`${tagId} is not a valid tag`);
        return found;
      }),
    };
  });
  const fuse = new Fuse(searchTargets, {
    keys: ["text", "tags.name"],
    threshold: 0.4,
  });
  const result = fuse.search(searchText);
  return result.map((r) => ({
    ...r.item,
    tags: r.item.tags.map((t) => t.id),
  }));
}
