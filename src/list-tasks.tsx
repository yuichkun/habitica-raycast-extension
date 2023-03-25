import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import { DailyLineItem } from "./DailyLineItem";
import { sortByDate } from "./date";
import { getAllTags, retrieveAllItems } from "./habitica";
import { useSearch } from "./hooks/useSearch";
import { TaskLineItem } from "./TaskLineItem";
import { HabiticaTaskTypes } from "./types";

const Command = () => {
  const [taskType, setTaskType] = useState<HabiticaTaskTypes>("todo");
  const {
    isLoading: isAllItemLoading,
    data: unfilteredItem,
    revalidate: refetchList,
  } = useCachedPromise(retrieveAllItems, [], {
    initialData: {
      tasks: [],
      dailys: [],
    },
  });
  const { isLoading: isAllTagLoading, data: allTags } = useCachedPromise(getAllTags, [], {
    keepPreviousData: true,
  });

  const { setSearchText, filteredItems } = useSearch(unfilteredItem, allTags);

  if (allTags === undefined) return null;

  return (
    <List
      isLoading={isAllItemLoading || isAllTagLoading}
      onSearchTextChange={setSearchText}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Set types of tasks to show"
          onChange={(v: string) => setTaskType(v as HabiticaTaskTypes)}
        >
          <List.Dropdown.Section>
            <List.Dropdown.Item title="To Do's" value="todo" icon={Icon.Pencil} />
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
        filteredItems.dailys.map((daily) => (
          <DailyLineItem key={daily.id} daily={daily} refetchList={refetchList} allTags={allTags} />
        ))}
    </List>
  );
};

export default Command;
