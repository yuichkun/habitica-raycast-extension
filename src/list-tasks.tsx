import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useEffect, useMemo, useState } from "react";
import { DailyLineItem } from "./DailyLineItem";
import { sortByDate } from "./date";
import { getAllTags, retrieveAllItems } from "./habitica";
import { useSearch } from "./hooks/useSearch";
import { TaskLineItem } from "./TaskLineItem";
import { HabiticaItems, HabiticaTaskTypes, Tag } from "./types";

const Command = () => {
  const initialData = useMemo(() => {
    return {
      tasks: [],
      dailys: [],
    } as HabiticaItems;
  }, []);

  const [taskType, setTaskType] = useState<HabiticaTaskTypes>("todo");
  const {
    isLoading: isAllItemLoading,
    data: unfilteredItem,
    revalidate: refetchList,
  } = useCachedPromise(retrieveAllItems, [], {
    initialData,
  });
  const { isLoading: isAllTagLoading, data: allTags } = useCachedPromise(getAllTags, [], {
    initialData: [] as Tag[],
  });

  const { searchText, setSearchText, filteredItems } = useSearch(unfilteredItem, allTags);
  useEffect(() => {
    if (taskType === "todo") {
      setSearchText("today");
    }
    if (taskType === "daily") {
      setSearchText("incomplete");
    }
  }, [taskType]);

  const filteredItemsCount = filteredItems.tasks.length;

  return (
    <List
      isLoading={isAllItemLoading || isAllTagLoading}
      searchBarPlaceholder="Search by anything. Task title, tags, date, etc."
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Set types of tasks to show"
          onChange={(v: string) => setTaskType(v as HabiticaTaskTypes)}
        >
          <List.Dropdown.Section>
            <List.Dropdown.Item title={`To Do's (${filteredItemsCount})`} value="todo" icon={Icon.Pencil} />
            <List.Dropdown.Item title="Dailies" value="daily" icon={Icon.Alarm} />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {taskType === "todo" &&
        filteredItems.tasks
          .sort(sortByDate)
          .map((task) => <TaskLineItem key={task.id} task={task} refetchList={refetchList} allTags={allTags} />)}
      {taskType === "daily" &&
        filteredItems.dailys
          .filter((task) => task.isDue)
          .map((daily) => <DailyLineItem key={daily.id} daily={daily} refetchList={refetchList} allTags={allTags} />)}
    </List>
  );
};

export default Command;
