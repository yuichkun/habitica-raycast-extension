import { ActionPanel, Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { FC } from "react";
import { HabiticaEditMenu } from "./actions/edit";
import { determineColor, sortByDate } from "./date";
import { getAllTags, retrieveTasks } from "./habitica";
import { useSearch } from "./hooks/useSearch";
import { nameToColor } from "./nameToColor";
import { priorityToColor } from "./priorityToColor";
import { HabiticaTask, Tag } from "./types";

const Command = () => {
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
    <List isLoading={isAllTasksLoading || isAllTagLoading} onSearchTextChange={setSearchText}>
      {filteredTasks.sort(sortByDate).map((task) => (
        <TaskLineItem key={task.id} task={task} refetchList={revalidate} allTags={allTags} />
      ))}
    </List>
  );
};

const TaskLineItem: FC<{ task: HabiticaTask; refetchList: () => void; allTags: Tag[] }> = ({
  task,
  refetchList,
  allTags,
}) => {
  const tags = task.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    if (!found) throw new Error(`${tagId} is not a valid tag id`);
    return found;
  });
  return (
    <List.Item
      key={task.id}
      title={task.text}
      actions={
        <ActionPanel title="Habitica">
          <HabiticaEditMenu task={task} refetchList={refetchList} />
        </ActionPanel>
      }
      accessories={[
        ...tags.map((tag) => ({
          tag: {
            value: tag.name,
            color: nameToColor(tag.name),
          },
        })),
        {
          date: task.date
            ? {
                color: priorityToColor(determineColor(task.date)),
                value: new Date(task.date),
              }
            : null,
        },
      ]}
      detail={
        <List.Item.Detail
          metadata={
            <List.Item.Detail.Metadata>
              <List.Item.Detail.Metadata.Label
                title="Due Date"
                text={task.date ?? "No Due Date"}
                icon={Icon.Calendar}
              />
              <List.Item.Detail.Metadata.Separator />
            </List.Item.Detail.Metadata>
          }
        />
      }
    />
  );
};

export default Command;
