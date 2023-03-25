import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import { HabiticaTask, Tag } from "../types";

export function useSearch(unfilteredTasks: HabiticaTask[], allTags?: Tag[]) {
  const [searchText, setSearchText] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<HabiticaTask[]>(unfilteredTasks);
  useEffect(() => {
    if (searchText === "") {
      setFilteredTasks(unfilteredTasks);
      return;
    }
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
    });
    const result = fuse.search(searchText);
    setFilteredTasks(
      result.map((r) => ({
        ...r.item,
        tags: r.item.tags.map((t) => t.id),
      }))
    );
  }, [searchText]);
  return {
    setSearchText,
    filteredTasks,
  };
}
