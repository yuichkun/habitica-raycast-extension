import { ActionPanel, List } from "@raycast/api";
import { FC } from "react";
import { HabiticaEditMenu } from "./actions/edit";
import { getConfig } from "./config";
import { determinePriority } from "./date";
import { nameToColor } from "./nameToColor";
import { priorityToColor } from "./priorityToColor";
import { findTags } from "./tag";
import { HabiticaTask, Tag } from "./types";

type Props = {
  task: HabiticaTask;
  refetchList: () => void;
  allTags: Tag[];
};

export const TaskLineItem: FC<Props> = ({ task, refetchList, allTags }) => {
  const { language } = getConfig();
  const tags = findTags(task, allTags);
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
          text: task.date
            ? {
                color: priorityToColor(determinePriority(task.date)),
                value: new Date(task.date).toLocaleDateString(language),
              }
            : null,
        },
      ]}
    />
  );
};
