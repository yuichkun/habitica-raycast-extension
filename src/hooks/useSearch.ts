import { useEffect, useState } from "react";
import { searchTasks } from "../search";
import { HabiticaItems, Tag } from "../types";

export function useSearch(unfilteredItems: HabiticaItems, allTags?: Tag[]) {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState<HabiticaItems>(unfilteredItems);
  useEffect(() => {
    if (searchText === "") {
      setFilteredItems(unfilteredItems);
      return;
    }
    const tasks = searchTasks(unfilteredItems.tasks, allTags, searchText);
    setFilteredItems({
      tasks,
      dailys: unfilteredItems.dailys,
    });
  }, [searchText, unfilteredItems]);
  return {
    setSearchText,
    filteredItems,
  };
}
