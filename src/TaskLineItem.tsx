import { List, ActionPanel, Icon } from "@raycast/api";
import { FC } from "react";
import { HabiticaEditMenu } from "./actions/edit";
import { determineColor } from "./date";
import { nameToColor } from "./nameToColor";
import { priorityToColor } from "./priorityToColor";
import { HabiticaTask, Tag } from "./types";

type Props = {
  task: HabiticaTask;
  refetchList: () => void;
  allTags: Tag[];
};

export const TaskLineItem: FC<Props> = ({ task, refetchList, allTags }) => {
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
          <HabiticaEditMenu item={task} refetchList={refetchList} />
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
    />
  );
};
