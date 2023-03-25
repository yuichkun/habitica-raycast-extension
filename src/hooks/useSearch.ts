import Fuse from "fuse.js";
import { useState, useEffect } from "react";
import { HabiticaItems, HabiticaTask, Tag } from "../types";

export function useSearch(unfilteredItems: HabiticaItems, allTags?: Tag[]) {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<HabiticaItems>(unfilteredItems);
  useEffect(() => {
    if (searchText === "") {
      setFilteredItems(unfilteredItems);
      return;
    }
    const searchTargets = unfilteredItems.tasks.map((task) => {
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
    setFilteredItems({
      tasks: result.map((r) => ({
        ...r.item,
        tags: r.item.tags.map((t) => t.id),
      })),
      dailys: unfilteredItems.dailys,
    });
  }, [searchText]);
  return {
    setSearchText,
    filteredItems,
  };
}
