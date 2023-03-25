import { Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import { sortByDate } from "./date";
import { getAllTags, retrieveTasks } from "./habitica";
import { useSearch } from "./hooks/useSearch";
import { TaskLineItem } from "./TaskLineItem";
import { HabiticaTaskTypes } from "./types";

const Command = () => {
  const [taskType, setTaskType] = useState<HabiticaTaskTypes>("todo");
  const {
    isLoading: isAllTasksLoading,
    data: unfilteredTasks,
    revalidate,
  } = useCachedPromise(retrieveTasks, [], {
    initialData: [],
  });
  const { isLoading: isAllTagLoading, data: allTags } = useCachedPromise(getAllTags, [], {
    keepPreviousData: true,
  });

  const { setSearchText, filteredTasks } = useSearch(unfilteredTasks, allTags);

  if (allTags === undefined) return null;

  return (
    <List
      isLoading={isAllTasksLoading || isAllTagLoading}
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
      {filteredTasks.sort(sortByDate).map((task) => (
        <TaskLineItem key={task.id} task={task} refetchList={revalidate} allTags={allTags} />
      ))}
    </List>
  );
};

export default Command;
