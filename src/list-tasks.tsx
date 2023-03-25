import { ActionPanel, Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { FC } from "react";
import { HabiticaEditMenu } from "./actions/edit";
import { determineColor } from "./date";
import { getTags, retrieveTasks } from "./habitica";
import { nameToColor } from "./nameToColor";
import { priorityToColor } from "./priorityToColor";
import { HabiticaTask } from "./types";

const Command = () => {
  const { isLoading, data, revalidate } = useCachedPromise(retrieveTasks, [], {
    initialData: [],
  });

  return (
    <List isLoading={isLoading}>
      {data.sort(sortByDate).map((task) => (
        <TaskLineItem key={task.id} task={task} refetchList={revalidate} />
      ))}
    </List>
  );
};

const TaskLineItem: FC<{ task: HabiticaTask; refetchList: () => void }> = ({ task, refetchList }) => {
  const { isLoading, data: tags } = useCachedPromise(getTags, [task.tags]);

  if (isLoading || tags === undefined) return null;
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

function sortByDate(a: HabiticaTask, b: HabiticaTask) {
  if (a.date && b.date) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  } else if (a.date) {
    return -1;
  } else if (b.date) {
    return 1;
  } else {
    return 0;
  }
}

export default Command;
