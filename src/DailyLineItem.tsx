import { ActionPanel, Color, List } from "@raycast/api";
import { FC } from "react";
import { HabiticaEditMenu } from "./actions/edit";
import { nameToColor } from "./nameToColor";
import { HabiticaDaily, Tag } from "./types";

type Props = {
  daily: HabiticaDaily;
  refetchList: () => void;
  allTags: Tag[];
};

export const DailyLineItem: FC<Props> = ({ daily, refetchList, allTags }) => {
  const tags = daily.tags.map((tagId) => {
    const found = allTags.find((tag) => tag.id === tagId);
    if (!found) throw new Error(`${tagId} is not a valid tag id`);
    return found;
  });
  return (
    <List.Item
      actions={
        <ActionPanel title="Daily">
          <HabiticaEditMenu item={daily} refetchList={refetchList} />
        </ActionPanel>
      }
      key={daily.id}
      title={daily.text}
      accessories={[
        ...tags.map((tag) => ({
          tag: {
            value: tag.name,
            color: nameToColor(tag.name),
          },
        })),
        {
          text: {
            color: daily.completed ? Color.Green : Color.SecondaryText,
            value: daily.completed ? "Done" : "Incomplete",
          },
        },
      ]}
    />
  );
};
